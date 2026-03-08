import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CodePanel from "@/components/editor/CodePanel";
import PreviewFrame from "@/components/editor/PreviewFrame";
import Toolbar from "@/components/editor/Toolbar";
import ConsolePanel, { ConsoleEntry } from "@/components/editor/ConsolePanel";
import { DeviceType, deviceWidths } from "@/components/editor/DeviceSimulator";
import { useProject } from "@/hooks/useProject";
import { getProjectsFromStorage } from "@/lib/projectEncoder";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const DEBOUNCE_MS = 3000;

const Editor = () => {
  const { projectId } = useParams();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [codeVisible, setCodeVisible] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const existingProject = projectId
    ? getProjectsFromStorage().find((p) => p.id === projectId)
    : undefined;

  const { project, updateField, addPackage, removePackage, save } =
    useProject(existingProject);

  const [html, setHtml] = useState(project.html);
  const [css, setCss] = useState(project.css);
  const [js, setJs] = useState(project.js);

  // Preview state (debounced)
  const [previewHtml, setPreviewHtml] = useState(project.html);
  const [previewCss, setPreviewCss] = useState(project.css);
  const [previewJs, setPreviewJs] = useState(project.js);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const scheduleUpdate = useCallback(() => {
    setIsUpdating(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPreviewHtml(html);
      setPreviewCss(css);
      setPreviewJs(js);
      updateField("html", html);
      updateField("css", css);
      updateField("js", js);
      setIsUpdating(false);
    }, DEBOUNCE_MS);
  }, [html, css, js, updateField]);

  // Auto-save to localStorage whenever project changes
  useEffect(() => {
    const autoSaveTimeout = setTimeout(() => {
      save();
    }, DEBOUNCE_MS + 500);
    return () => clearTimeout(autoSaveTimeout);
  }, [save]);

  useEffect(() => {
    scheduleUpdate();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [scheduleUpdate]);

  const handleConsoleEntry = useCallback((entry: ConsoleEntry) => {
    setConsoleEntries((prev) => [...prev, entry]);
  }, []);

  const tabs = [
    { key: "html" as const, label: "HTML", color: "hsl(15, 85%, 60%)" },
    { key: "css" as const, label: "CSS", color: "hsl(210, 85%, 60%)" },
    { key: "js" as const, label: "JS", color: "hsl(50, 85%, 55%)" },
  ];

  const values = { html, css, js };
  const setters = { html: setHtml, css: setCss, js: setJs };

  const editorPanel = (
    <div className="flex flex-col h-full min-h-0">
      {/* Tabs */}
      <div className="flex border-b border-border/50 shrink-0 bg-secondary/10">
        {tabs.map((tab) => (
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

      {/* Active panel with fade transition */}
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
              value={values[activeTab]}
              onChange={setters[activeTab]}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  const previewPanel = (
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
        consoleOpen={consoleOpen}
        onToggleConsole={() => setConsoleOpen((v) => !v)}
        codeVisible={codeVisible}
        onToggleCode={() => setCodeVisible((v) => !v)}
        previewVisible={previewVisible}
        onTogglePreview={() => setPreviewVisible((v) => !v)}
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
