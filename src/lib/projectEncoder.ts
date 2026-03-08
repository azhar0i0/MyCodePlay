export interface Project {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  packages: string[];
  createdAt: number;
  updatedAt: number;
}

export function createEmptyProject(name = "Untitled Project"): Project {
  return {
    id: crypto.randomUUID(),
    name,
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
    h: project.html,
    c: project.css,
    j: project.js,
    p: project.packages,
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
      html: data.h || "",
      css: data.c || "",
      js: data.j || "",
      packages: data.p || [],
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
