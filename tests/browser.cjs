const assert = require("node:assert/strict");
const puppeteer = require("puppeteer-core");

const origin = "http://127.0.0.1:8080";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROME_BIN || "/usr/bin/google-chrome",
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  try {
    for (const width of [320, 375, 430, 768, 1024, 1440]) {
      const page = await browser.newPage();
      const errors = [];
      page.on("pageerror", err => errors.push(err.message));
      await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
      await page.goto(origin, { waitUntil: "networkidle2", timeout: 30000 });
      const dimensions = await page.evaluate(() => ({
        screen: window.innerWidth,
        content: document.documentElement.scrollWidth,
        hero: document.querySelector("h1")?.getBoundingClientRect().width ?? 0
      }));
      assert.ok(dimensions.content <= dimensions.screen + 2, width + "px: horizontal overflow: " + JSON.stringify(dimensions));
      assert.equal(errors.length, 0, width + "px page errors: " + errors.join(" | "));
      if (width === 390 || width === 375) {
        await page.click("#menu-toggle");
        assert.equal(await page.$eval("#menu-toggle", el => el.getAttribute("aria-expanded")), "true");
        assert.equal(await page.$eval("#mobile-navigation", el => el.hidden), false);
        await page.click('.mobile-nav a[href="#services"]');
        assert.equal(await page.$eval("#mobile-navigation", el => el.hidden), true);
      }
      if (width === 1440) {
        await page.click('[data-filter="web"]');
        assert.equal(await page.$$eval('.project-card:not([hidden])', elements => elements.length), 2);
        await page.click('[data-project="taxi"]');
        assert.equal(await page.$eval("#project-dialog", el => el.open), true);
        assert.equal(await page.$eval("#project-dialog-title", el => el.textContent.trim()), "Taxi Service");
        await page.click('#project-dialog [data-close-dialog]');

        await page.click('.faq-list summary');
        assert.equal(await page.$eval(".faq-list details", el => el.open), true);

        await page.type('#brief-form [name="name"]', "Alex Sample");
        await page.type('#brief-form [name="email"]', "alex@example.com");
        await page.select('#brief-form [name="service"]', "Website / landing page");
        await page.type('#brief-form [name="message"]', "I would like a responsive site with a clear portfolio and simple navigation.");
        await page.click('#brief-form [type="submit"]');
        assert.equal(await page.$eval("#brief-dialog", el => el.open), true);
        assert.match(await page.$eval("#brief-preview", el => el.value), /Alex Sample/);
        assert.match(await page.$eval("#brief-preview", el => el.value), /No information has been submitted to a server/);
        await page.click('#brief-dialog [data-close-dialog]');

        const brokenImages = await page.$$eval('img', els => els.filter(el => el.complete && el.naturalWidth === 0).map(el => el.getAttribute("src")));
        assert.deepEqual(brokenImages, [], "Broken project images");
      }
      console.log("PASS", width, JSON.stringify(dimensions));
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(err => { console.error(err); process.exitCode = 1; });
