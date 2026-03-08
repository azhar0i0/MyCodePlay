import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CodePanel from "@/components/editor/CodePanel";
import PreviewFrame from "@/components/editor/PreviewFrame";
import Toolbar from "@/components/editor/Toolbar";
import { DeviceType, deviceWidths } from "@/components/editor/DeviceSimulator";
import { useProject } from "@/hooks/useProject";
import { getProjectsFromStorage } from "@/lib/projectEncoder";
import { useIsMobile } from "@/hooks/use-mobile";

const Editor = () => {
  const { projectId } = useParams();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [device, setDevice] = useState<DeviceType>("desktop");

  const existingProject = projectId
    ? getProjectsFromStorage().find((p) => p.id === projectId)
    : undefined;

  const { project, updateField, addPackage, removePackage, save, isSaved, getShareUrl } =
    useProject(existingProject);

  const [html, setHtml] = useState(project.html);
  const [css, setCss] = useState(project.css);
  const [js, setJs] = useState(project.js);

  // Debounced update to project
  useEffect(() => {
    const t = setTimeout(() => {
      updateField("html", html);
    }, 300);
    return () => clearTimeout(t);
  }, [html, updateField]);

  useEffect(() => {
    const t = setTimeout(() => {
      updateField("css", css);
    }, 300);
    return () => clearTimeout(t);
  }, [css, updateField]);

  useEffect(() => {
    const t = setTimeout(() => {
      updateField("js", js);
    }, 300);
    return () => clearTimeout(t);
  }, [js, updateField]);

  const tabs = [
    { key: "html" as const, label: "HTML" },
    { key: "css" as const, label: "CSS" },
    { key: "js" as const, label: "JS" },
  ];

  const values = { html, css, js };
  const setters = {
    html: setHtml,
    css: setCss,
    js: setJs,
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Toolbar
        projectName={project.name}
        onNameChange={(name) => updateField("name", name)}
        onSave={save}
        isSaved={isSaved}
        getShareUrl={getShareUrl}
        device={device}
        onDeviceChange={setDevice}
        packages={project.packages}
        onAddPackage={addPackage}
        onRemovePackage={removePackage}
      />

      <div className="flex-1 flex min-h-0">
        {/* Code panels */}
        <div className="w-full md:w-1/2 flex flex-col min-h-0 border-r border-border/50">
          {/* Tabs for mobile or stacked view */}
          {isMobile ? (
            <>
              <div className="flex border-b border-border/50 shrink-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      activeTab === tab.key
                        ? "text-foreground border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 min-h-0">
                <CodePanel
                  language={activeTab.toUpperCase()}
                  value={values[activeTab]}
                  onChange={setters[activeTab]}
                />
              </div>
            </>
          ) : (
            <>
              {/* Desktop: stacked three panels */}
              <div className="flex-1 flex flex-col min-h-0 divide-y divide-border/30">
                <div className="flex-1 min-h-0 overflow-auto">
                  <CodePanel language="HTML" value={html} onChange={setHtml} />
                </div>
                <div className="flex-1 min-h-0 overflow-auto">
                  <CodePanel language="CSS" value={css} onChange={setCss} />
                </div>
                <div className="flex-1 min-h-0 overflow-auto">
                  <CodePanel language="JS" value={js} onChange={setJs} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Preview */}
        <div className="hidden md:flex flex-1 min-h-0">
          <PreviewFrame
            html={project.html}
            css={project.css}
            js={project.js}
            packages={project.packages}
            width={deviceWidths[device]}
          />
        </div>
      </div>

      {/* Mobile preview toggle */}
      {isMobile && (
        <div className="h-[40vh] border-t border-border/50">
          <PreviewFrame
            html={project.html}
            css={project.css}
            js={project.js}
            packages={project.packages}
            width={deviceWidths[device]}
          />
        </div>
      )}
    </div>
  );
};

export default Editor;
