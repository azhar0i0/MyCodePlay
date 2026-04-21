# CodePlayground by azhar0i0

A premium real-time HTML, CSS & JavaScript code editor that runs entirely in your browser. No installation, no backend — just open and start building.

![Hero Section Preview Image](/preview.png)

## ✨ Features

### Real-Time Code Editor
Write HTML, CSS, and JavaScript in separate panels with instant live preview. Changes render in real-time in a sandboxed iframe as you type. Error overlay catches and displays runtime errors.

### NPM Package Imports
Import any npm package directly via the unpkg CDN — no build step required. Add packages like `lodash`, `axios`, or `gsap` from the package dialog and they're auto-injected into your preview.

### Live Preview with Device Simulation
Preview your project on **mobile (375px)**, **tablet (768px)**, and **desktop (full-width)** viewports with a single click. Smooth animated transitions between device sizes.

### Save & Share Projects
- **Local Save**: Projects are stored in localStorage with full project list management.
- **Shareable Links**: Generate instant shareable URLs that encode your entire project. Anyone with the link can view or fork your work.

### Responsive Design
The editor adapts to any screen size. On mobile, code panels stack with tab navigation and the preview renders below. On desktop, panels and preview sit side-by-side.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ & npm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project
cd codeplayground

# Install dependencies
npm install

# Start development server
npm run dev
```

### Deployment (Vercel)

The project includes `vercel.json` for seamless deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── editor/
│   │   ├── CodePanel.tsx        # Code editing textarea with language labels
│   │   ├── DeviceSimulator.tsx  # Mobile/tablet/desktop viewport toggle
│   │   ├── PackageImporter.tsx  # NPM package dialog
│   │   ├── PreviewFrame.tsx     # Sandboxed iframe with live rendering
│   │   └── Toolbar.tsx          # Save, share, device controls
│   ├── landing/
│   │   ├── Hero.tsx             # Hero section with CTAs
│   │   ├── Features.tsx         # Feature cards grid
│   │   ├── HowItWorks.tsx       # 3-step flow
│   │   └── Footer.tsx           # Site footer
│   └── ui/                      # shadcn/ui components
├── hooks/
│   ├── useProject.ts            # Project state management
│   └── use-mobile.tsx           # Responsive breakpoint hook
├── lib/
│   ├── projectEncoder.ts        # Save/load/encode/decode projects
│   └── utils.ts                 # Utility functions
├── pages/
│   ├── Landing.tsx              # Marketing homepage
│   ├── Editor.tsx               # Main code playground
│   ├── SharedProject.tsx        # Read-only shared project viewer
│   └── NotFound.tsx             # 404 page
└── index.css                    # Design system tokens
```

## 🎨 Design System

- **Typography**: Inter (UI) + JetBrains Mono (code)
- **Theme**: Dark-mode-first with glassmorphism panels
- **Colors**: Purple → Blue → Cyan gradient palette
- **Animations**: Framer Motion for page transitions, scroll reveals, and micro-interactions

## 🛠️ Tech Stack

- **React 18** + TypeScript
- **Vite** — Lightning-fast dev server
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations
- **shadcn/ui** — UI component library
- **React Router** — Client-side routing

## 📄 Usage

1. **Open the editor** — Click "Start Coding" from the landing page
2. **Write code** — Use the HTML, CSS, and JS panels
3. **Add packages** — Click the Packages button to import npm libraries
4. **Simulate devices** — Toggle between mobile, tablet, and desktop views
5. **Save** — Click Save to store locally
6. **Share** — Click Share to copy a shareable link to your clipboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

MIT © azhar0i0

---

Built with ❤️ by [azhar0i0](https://github.com/azhar0i0)
