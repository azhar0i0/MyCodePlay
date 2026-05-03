import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CodePanel from "@/components/editor/CodePanel";
import PreviewFrame from "@/components/editor/PreviewFrame";
import ReactPreviewFrame from "@/components/editor/ReactPreviewFrame";
import Toolbar from "@/components/editor/Toolbar";
import ConsolePanel, { ConsoleEntry } from "@/components/editor/ConsolePanel";
import { DeviceType, deviceWidths } from "@/components/editor/DeviceSimulator";
import { useProject } from "@/hooks/useProject";
import { getProjectsFromStorage } from "@/lib/projectEncoder";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus, X, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";



const LANG_MAP: Record<string, string> = {
  ".jsx": "javascript",
  ".js": "javascript",
  ".tsx": "typescript",
  ".ts": "typescript",
  ".css": "css",
  ".html": "html",
  ".json": "json",
};

function getFileLanguage(filename: string): string {
  const ext = filename.substring(filename.lastIndexOf("."));
  return LANG_MAP[ext] || "javascript";
}

const fileColors: Record<string, string> = {
  ".jsx": "hsl(210, 85%, 60%)",
  ".js": "hsl(50, 85%, 55%)",
  ".css": "hsl(280, 85%, 60%)",
  ".html": "hsl(15, 85%, 60%)",
  ".json": "hsl(140, 60%, 50%)",
};

function getFileColor(filename: string): string {
  const ext = filename.substring(filename.lastIndexOf("."));
  return fileColors[ext] || "hsl(210, 60%, 60%)";
}

const Editor = () => {
  const { projectId } = useParams();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [activeFile, setActiveFile] = useState("App.jsx");
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [codeVisible, setCodeVisible] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(true);
  
  const [newFileName, setNewFileName] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);

  const existingProject = projectId
    ? getProjectsFromStorage().find((p) => p.id === projectId)
    : undefined;

  const {
    project, updateField, updateFile, addFile, deleteFile,
    switchMode, addPackage, removePackage, save,
  } = useProject(existingProject);

  const isReact = project.mode === "react";

  // Vanilla mode state
  const [html, setHtml] = useState(project.html);
  const [css, setCss] = useState(project.css);
  const [js, setJs] = useState(project.js);

  // React mode: files snapshot for preview
  const [previewFiles, setPreviewFiles] = useState<Record<string, string>>(project.files || {});

  // Vanilla preview state
  const [previewHtml, setPreviewHtml] = useState(project.html);
  const [previewCss, setPreviewCss] = useState(project.css);
  const [previewJs, setPreviewJs] = useState(project.js);

  // Manual run handler
  const handleRun = useCallback(() => {
    if (isReact) {
      setPreviewFiles({ ...(project.files || {}) });
    } else {
      setPreviewHtml(html);
      setPreviewCss(css);
      setPreviewJs(js);
      updateField("html", html);
      updateField("css", css);
      updateField("js", js);
    }
    save();
  }, [isReact, project.files, html, css, js, updateField, save]);

  // Keyboard shortcut: Ctrl+Enter to run
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun]);

  const handleConsoleEntry = useCallback((entry: ConsoleEntry) => {
    setConsoleEntries((prev) => [...prev, entry]);
  }, []);

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    let name = newFileName.trim();
    if (!name.includes(".")) name += ".jsx";
    addFile(name, "");
    setActiveFile(name);
    setNewFileName("");
    setShowNewFile(false);
  };

  const handleDeleteFile = (filename: string) => {
    if (filename === "App.jsx" || filename === "index.jsx") return;
    deleteFile(filename);
    if (activeFile === filename) {
      setActiveFile("App.jsx");
    }
  };

  // === Vanilla tabs ===
  const vanillaTabs = [
    { key: "html" as const, label: "HTML", color: "hsl(15, 85%, 60%)" },
    { key: "css" as const, label: "CSS", color: "hsl(210, 85%, 60%)" },
    { key: "js" as const, label: "JS", color: "hsl(50, 85%, 55%)" },
  ];
  const vanillaValues = { html, css, js };
  const vanillaSetters = { html: setHtml, css: setCss, js: setJs };

  // === Editor panel ===
  const editorPanel = isReact ? (
    <div className="flex flex-col h-full min-h-0">
      {/* React file tabs */}
      <div className="flex items-center border-b border-border/50 shrink-0 bg-secondary/10 overflow-x-auto">
        {Object.keys(project.files || {}).map((filename) => (
          <button
            key={filename}
            onClick={() => setActiveFile(filename)}
            className={cn(
              "relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap group",
              activeFile === filename
                ? "text-foreground bg-background/50"
                : "text-muted-foreground hover:text-foreground/70 hover:bg-secondary/20"
            )}
          >
            <FileCode className="w-3 h-3" style={{ color: getFileColor(filename) }} />
            {filename}
            {filename !== "App.jsx" && filename !== "index.jsx" && (
              <span
                onClick={(e) => { e.stopPropagation(); handleDeleteFile(filename); }}
                className="ml-1 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </span>
            )}
            {activeFile === filename && (
              <motion.div
                layoutId="activeFileTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
        {showNewFile ? (
          <div className="flex items-center px-2">
            <input
              autoFocus
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddFile(); if (e.key === "Escape") setShowNewFile(false); }}
              onBlur={() => { if (!newFileName.trim()) setShowNewFile(false); }}
              placeholder="filename.jsx"
              className="bg-transparent text-xs text-foreground w-24 focus:outline-none border-b border-primary/50 px-1 py-0.5"
            />
          </div>
        ) : (
          <button
            onClick={() => setShowNewFile(true)}
            className="px-2 py-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {/* Active file editor */}
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFile}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="h-full"
          >
            <CodePanel
              language={getFileLanguage(activeFile).toUpperCase()}
              value={(project.files || {})[activeFile] || ""}
              onChange={(val) => updateFile(activeFile, val)}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  ) : (
    <div className="flex flex-col h-full min-h-0">
      {/* Vanilla tabs */}
      <div className="flex border-b border-border/50 shrink-0 bg-secondary/10">
        {vanillaTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === tab.key
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/70"
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full transition-transform duration-200"
                style={{
                  backgroundColor: tab.color,
                  transform: activeTab === tab.key ? "scale(1)" : "scale(0.7)",
                  opacity: activeTab === tab.key ? 1 : 0.5,
                }}
              />
              {tab.label}
            </span>
            {activeTab === tab.key && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0"
          >
            <CodePanel
              language={activeTab.toUpperCase()}
              value={vanillaValues[activeTab]}
              onChange={vanillaSetters[activeTab]}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  const previewPanel = isReact ? (
    <ReactPreviewFrame
      files={previewFiles}
      packages={project.packages}
      width={deviceWidths[device]}
      isUpdating={isUpdating}
      onConsoleEntry={handleConsoleEntry}
    />
  ) : (
    <PreviewFrame
      html={previewHtml}
      css={previewCss}
      js={previewJs}
      packages={project.packages}
      width={deviceWidths[device]}
      isUpdating={isUpdating}
      onConsoleEntry={handleConsoleEntry}
    />
  );

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Toolbar
        projectName={project.name}
        onNameChange={(name) => updateField("name", name)}
        device={device}
        onDeviceChange={setDevice}
        packages={project.packages}
        onAddPackage={addPackage}
        onRemovePackage={removePackage}
        onRun={handleRun}
        consoleOpen={consoleOpen}
        onToggleConsole={() => setConsoleOpen((v) => !v)}
        codeVisible={codeVisible}
        onToggleCode={() => setCodeVisible((v) => !v)}
        previewVisible={previewVisible}
        onTogglePreview={() => setPreviewVisible((v) => !v)}
        mode={project.mode}
        onModeChange={switchMode}
      />

      <div className="flex-1 flex flex-col min-h-0">
        {isMobile ? (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-0">{editorPanel}</div>
            <div className="h-[40vh] border-t border-border/50">{previewPanel}</div>
          </div>
        ) : (
          <div className="flex-1 min-h-0">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {codeVisible && (
                <>
                  <ResizablePanel defaultSize={50} minSize={20}>
                    {editorPanel}
                  </ResizablePanel>
                  {previewVisible && <ResizableHandle withHandle />}
                </>
              )}
              {previewVisible && (
                <ResizablePanel defaultSize={codeVisible ? 50 : 100} minSize={20}>
                  {previewPanel}
                </ResizablePanel>
              )}
              {!codeVisible && !previewVisible && (
                <ResizablePanel defaultSize={100}>
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    Toggle code or preview to get started
                  </div>
                </ResizablePanel>
              )}
            </ResizablePanelGroup>
          </div>
        )}

        <ConsolePanel
          entries={consoleEntries}
          onClear={() => setConsoleEntries([])}
          isOpen={consoleOpen}
        />
      </div>
    </div>
  );
};

export default Editor;
