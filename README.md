# Yahia Al-Tarhouni — Portfolio

A bilingual Arabic/English executive portfolio for Yahia Al-Tarhouni, focused on commercial growth, business development, strategic partnerships, operations and performance marketing in Saudi Arabia.

## Highlights

- Arabic/English switch with full RTL support
- Responsive editorial design for desktop and mobile
- Accessible navigation, reduced-motion support and print-ready CV styling
- WhatsApp, phone, copy-number and downloadable vCard actions
- Local fonts and assets with no third-party page requests
- GitHub Pages workflow included

## Local preview

Open `index.html` directly, or serve the folder with any static web server.

## Project structure

```text
yahia-altarhouni-website/
├── assets/
│   ├── contact/       # Downloadable contact card
│   ├── fonts/         # Locally hosted typefaces
│   └── images/        # Favicon and social-sharing artwork
├── scripts/
│   ├── build.mjs      # Production build
│   └── site.js        # Language, navigation and contact interactions
├── styles/
│   └── main.css       # Visual design and responsive layout
├── .github/workflows/ # GitHub Pages deployment
├── .openai/           # OpenAI Sites hosting configuration
├── index.html         # Page content and structure
└── package.json       # Project commands
```

## Updating the site

- Edit page copy and sections in `index.html`. English and Arabic text are paired with `data-en` and `data-ar`.
- Edit the visual design in `styles/main.css`.
- Edit language, navigation and contact interactions in `scripts/site.js`.
- Replace the social preview and favicon in `assets/images/`.
- Replace the downloadable contact card in `assets/contact/`.

## Build

```bash
npm run build
```

The production-ready website is generated in `dist/`.

© 2026 Yahia Ahmed Al-Tarhouni
