import { useParams, Link, useNavigate } from "react-router-dom";
import { decodeProject, saveProjectToStorage } from "@/lib/projectEncoder";
import PreviewFrame from "@/components/editor/PreviewFrame";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GitFork, Code2 } from "lucide-react";
import { useState } from "react";

const SharedProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");

  const project = id ? decodeProject(id) : null;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">This shared link is invalid or expired.</p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleFork = () => {
    const forked = { ...project, id: crypto.randomUUID(), name: `${project.name} (Fork)` };
    saveProjectToStorage(forked);
    navigate(`/editor/${forked.id}`);
  };

  const tabs = [
    { key: "html" as const, label: "HTML" },
    { key: "css" as const, label: "CSS" },
    { key: "js" as const, label: "JS" },
  ];

  const codeValues: Record<string, string> = {
    html: project.html,
    css: project.css,
    js: project.js,
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-secondary/20">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <h1 className="font-semibold text-sm">{project.name}</h1>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">
            Read Only
          </span>
        </div>
        <Button onClick={handleFork} size="sm" className="h-8 gap-1.5 text-xs">
          <GitFork className="w-3.5 h-3.5" />
          Fork & Edit
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 flex min-h-0">
        {/* Code view */}
        <div className="w-1/2 flex flex-col min-h-0 border-r border-border/50">
          <div className="flex border-b border-border/50 shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === tab.key
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <pre className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
            {codeValues[activeTab]}
          </pre>
        </div>

        {/* Preview */}
        <div className="flex-1 min-h-0">
          <PreviewFrame
            html={project.html}
            css={project.css}
            js={project.js}
            packages={project.packages}
          />
        </div>
      </div>
    </div>
  );
};

export default SharedProject;
