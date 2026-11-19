# WebStudio — Digital Experiences That Mean Business

A redesigned, responsive digital agency website built from the original WebStudio static-page repository, using its original portfolio image assets.

## Redesign

- New indigo / ink / citrus identity with Space Grotesk, DM Sans, original logo and favicon.
- Rebuilt hero with the existing studio office photograph.
- More content: four services, six work concepts, process, approach, FAQ and an interactive project-brief section.
- Functional mobile navigation, portfolio filters, project details dialogs, back-to-top and toast feedback.
- A browser-only project brief builder with native validation, clipboard copying and downloadable TXT file.
- Responsive layouts, visible keyboard focus, native dialog focus handling and reduced-motion support.

## Run

Static HTML, CSS and JavaScript. No build framework or paid dependencies.

Start a local HTTP server (Python example):

    python3 -m http.server 8080

Open http://localhost:8080 in your browser.

Structural checks require Node.js 20 or newer:

    node --check js/site.js
    node --test tests/site.test.mjs

## Important scope and authenticity notes

The original site contained placeholder contact information and a non-sending form. The new brief form does NOT submit data or claim to send email: it creates content locally for copying or download. Configure a verified address and a real backend/form provider before launching real customer enquiries.

The six work examples preserve the original template's project names and visual assets. They are concept demonstrations, not documented paying-client case studies with verified results. No fake testimonials or business metrics are used.

Main source files: index.html, css/styles.css, js/site.js.
