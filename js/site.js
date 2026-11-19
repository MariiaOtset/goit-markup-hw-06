"use strict";

(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const body = document.body;

  // Main navigation — accessible keyboard/menu interactions without dependencies.
  const menuToggle = $("#menu-toggle");
  const mobileNav = $("#mobile-navigation");
  const closeMenu = () => {
    mobileNav.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  };
  const openMenu = () => {
    mobileNav.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
  };
  menuToggle.addEventListener("click", () => {
    mobileNav.hidden ? openMenu() : closeMenu();
  });
  $$("a", mobileNav).forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("click", event => {
    if (!mobileNav.hidden && !mobileNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !mobileNav.hidden) {
      closeMenu();
      menuToggle.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1000 && !mobileNav.hidden) closeMenu();
  });

  // Portfolio categories — no page reload, no re-rendering of other sections.
  const filters = $$("[data-filter]");
  const projects = $$(".project-card[data-category]");
  const workCounter = $("#work-counter");
  filters.forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      let visible = 0;
      filters.forEach(item => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      projects.forEach(card => {
        const show = category === "all" || card.dataset.category === category;
        card.hidden = !show;
        if (show) visible++;
      });
      workCounter.textContent = "SHOWING " + String(visible).padStart(2, "0") + " " + (visible === 1 ? "PROJECT" : "PROJECTS");
    });
  });

  // Concept details reflect the original six portfolio thumbnails and titles.
  // They intentionally avoid fabricated metrics, fake clients, and endorsements.
  const projectData = {
    banking: {
      title: "Banking App", category: "DIGITAL PRODUCT / APP DESIGN",
      image: "./images/our-portfolio/desktop/img6@2x_result.jpg",
      alt: "Banking App visual design concept",
      description: "A product design direction built around making financial interactions feel understandable, focused and reassuring. A visual exploration of clear information hierarchy and intuitive navigation.",
      focus: ["App interface", "Visual hierarchy", "Product experience"]
    },
    cashless: {
      title: "Cashless Payment", category: "VISUAL CAMPAIGN / CREATIVE",
      image: "./images/our-portfolio/desktop/img5_desk@2x.jpg",
      alt: "Cashless Payment visual concept",
      description: "A creative direction exploring effortless everyday payments, with an emphasis on clear messaging, confident colour and a cohesive visual system.",
      focus: ["Campaign concept", "Art direction", "Digital communication"]
    },
    meditation: {
      title: "Meditation App", category: "DIGITAL PRODUCT / APP DESIGN",
      image: "./images/our-portfolio/desktop/img4@2x_result.jpg",
      alt: "Meditation App visual design concept",
      description: "A calmer digital interface concept that gives users a sense of focus and breathing room. Simple flows and thoughtful spacing put the experience first.",
      focus: ["Mobile app concept", "UX clarity", "Interface design"]
    },
    taxi: {
      title: "Taxi Service", category: "WEB EXPERIENCE / DIGITAL SERVICE",
      image: "./images/our-portfolio/desktop/img3@2x_result.jpg",
      alt: "Taxi Service visual design concept",
      description: "A concept for straightforward trip discovery and digital booking interactions, showing how a service can feel approachable and easy to navigate.",
      focus: ["Service experience", "Responsive design", "Interaction concepts"]
    },
    illustration: {
      title: "Screen Illustrations", category: "ART DIRECTION / VISUAL DESIGN",
      image: "./images/our-portfolio/desktop/img2@2x_result.jpg",
      alt: "Screen Illustrations visual concept",
      description: "An illustration-led direction for expressive digital surfaces, exploring how thoughtful graphics can make an interface feel more human and distinctive.",
      focus: ["Illustration", "Visual identity", "UI personality"]
    },
    courses: {
      title: "Online Courses", category: "WEB PLATFORM / EDUCATION",
      image: "./images/our-portfolio/desktop/img1@2x_result.jpg",
      alt: "Online Courses visual design concept",
      description: "A learning platform concept built around clear content structure, engaging visual rhythm and an accessible path from exploration to learning.",
      focus: ["Learning experience", "Content structure", "Responsive UI"]
    }
  };
  const projectDialog = $("#project-dialog");
  const openProject = id => {
    const item = projectData[id];
    if (!item || !projectDialog) return;
    $("#project-dialog-category").textContent = item.category;
    $("#project-dialog-title").textContent = item.title;
    $("#project-dialog-image").src = item.image;
    $("#project-dialog-image").alt = item.alt;
    $("#project-dialog-description").textContent = item.description;
    const list = $("#project-dialog-tags");
    list.replaceChildren();
    item.focus.forEach(label => {
      const li = document.createElement("li");
      li.textContent = label;
      list.append(li);
    });
    projectDialog.showModal();
  };
  $$("[data-project]").forEach(button => button.addEventListener("click", () => openProject(button.dataset.project)));

  const briefForm = $("#brief-form");
  const briefDialog = $("#brief-dialog");
  const briefPreview = $("#brief-preview");
  const toast = $("#toast");
  let toastTimer;
  const inform = message => {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3600);
  };

  // Project brief builder — everything runs in the browser.
  // This deliberately does NOT imply that the website has a working mail backend.
  const briefContent = values => [
    "WEBSTUDIO — PROJECT BRIEF",
    "==========================",
    "",
    "Name: " + values.name.trim(),
    "Email: " + values.email.trim(),
    "Project type: " + values.service,
    "Ideal timeline: " + (values.timeline || "Still exploring"),
    "",
    "PROJECT DETAILS",
    "---------------",
    values.message.trim(),
    "",
    "Prepared in your browser on " + new Date().toLocaleDateString("en-GB"),
    "No information has been submitted to a server."
  ].join("\n");

  briefForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!briefForm.reportValidity()) return;
    const data = Object.fromEntries(new FormData(briefForm));
    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim() || !data.service) {
      inform("Please complete the required fields to prepare your brief.");
      return;
    }
    briefPreview.value = briefContent(data);
    briefDialog.showModal();
  });

  $("#copy-brief").addEventListener("click", async () => {
    const text = briefPreview.value;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard not available");
      await navigator.clipboard.writeText(text);
      inform("Project brief copied to clipboard.");
    } catch {
      briefPreview.focus();
      briefPreview.select();
      inform("Select and copy the highlighted brief using Ctrl/Cmd + C.");
    }
  });

  $("#download-brief").addEventListener("click", () => {
    const file = new Blob([briefPreview.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "webstudio-project-brief.txt";
    body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    inform("Your project brief was downloaded.");
  });

  // Native dialogs manage focus, escape-to-close, and restore focus.
  $$("[data-close-dialog]").forEach(button => button.addEventListener("click", () => button.closest("dialog")?.close()));
  [projectDialog, briefDialog].forEach(dialog => {
    dialog.addEventListener("click", event => {
      // A click on the native backdrop targets the dialog itself.
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
  });
  $("#project-dialog-cta").addEventListener("click", () => projectDialog.close());

  const backToTop = $("#back-to-top");
  const updateBackButton = () => {
    backToTop.hidden = window.scrollY < 720;
  };
  window.addEventListener("scroll", updateBackButton, { passive: true });
  updateBackButton();
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  });

  $("#copyright-year").textContent = String(new Date().getFullYear());
})();
