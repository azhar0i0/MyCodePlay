export type ProjectMode = "vanilla" | "react";

export interface Project {
  id: string;
  name: string;
  mode: ProjectMode;
  html: string;
  css: string;
  js: string;
  packages: string[];
  // React mode files
  files?: Record<string, string>;
  createdAt: number;
  updatedAt: number;
}

const DEFAULT_APP_JSX = `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <h1>⚛️ React Playground</h1>
      <p>Edit App.jsx and see changes live!</p>
      <div className="card">
        <button onClick={() => setCount(c => c + 1)}>
          Count: {count}
        </button>
      </div>
    </div>
  );
}

export default App;`;

const DEFAULT_APP_CSS = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0f0f1a;
  color: #e2e8f0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app {
  text-align: center;
  padding: 2rem;
}

.app h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #a855f7, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.app p {
  color: #94a3b8;
  margin-bottom: 2rem;
}

.card {
  padding: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #a855f7, #3b82f6);
  color: white;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(168, 85, 247, 0.4);
}

button:active {
  transform: translateY(0);
}`;

const DEFAULT_INDEX_JSX = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`;

export function createEmptyProject(name = "Untitled Project", mode: ProjectMode = "vanilla"): Project {
  if (mode === "react") {
    return {
      id: crypto.randomUUID(),
      name,
      mode: "react",
      html: "",
      css: "",
      js: "",
      packages: [],
      files: {
        "App.jsx": DEFAULT_APP_JSX,
        "index.jsx": DEFAULT_INDEX_JSX,
        "styles.css": DEFAULT_APP_CSS,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  return {
    id: crypto.randomUUID(),
    name,
    mode: "vanilla",
    html: `<div class="container">\n  <h1>Hello World</h1>\n  <p>Start coding!</p>\n</div>`,
    css: `.container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n  font-family: system-ui, sans-serif;\n  background: #0f0f1a;\n  color: #e2e8f0;\n}\n\nh1 {\n  font-size: 2.5rem;\n  background: linear-gradient(135deg, #a855f7, #3b82f6, #06b6d4);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}`,
    js: `console.log("Hello from CodePlayground!");`,
    packages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function encodeProject(project: Project): string {
  const json = JSON.stringify({
    n: project.name,
    m: project.mode,
    h: project.html,
    c: project.css,
    j: project.js,
    p: project.packages,
    f: project.files,
  });
  return btoa(encodeURIComponent(json));
}

export function decodeProject(encoded: string): Project | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const data = JSON.parse(json);
    return {
      id: crypto.randomUUID(),
      name: data.n || "Shared Project",
      mode: data.m || "vanilla",
      html: data.h || "",
      css: data.c || "",
      js: data.j || "",
      packages: data.p || [],
      files: data.f || undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  } catch {
    return null;
  }
}

export function saveProjectToStorage(project: Project): void {
  const projects = getProjectsFromStorage();
  const idx = projects.findIndex((p) => p.id === project.id);
  const updated = { ...project, updatedAt: Date.now() };
  if (idx >= 0) {
    projects[idx] = updated;
  } else {
    projects.push(updated);
  }
  localStorage.setItem("cp_projects", JSON.stringify(projects));
}

export function getProjectsFromStorage(): Project[] {
  try {
    return JSON.parse(localStorage.getItem("cp_projects") || "[]");
  } catch {
    return [];
  }
}

export function deleteProjectFromStorage(id: string): void {
  const projects = getProjectsFromStorage().filter((p) => p.id !== id);
  localStorage.setItem("cp_projects", JSON.stringify(projects));
}
