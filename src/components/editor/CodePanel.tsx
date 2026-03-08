import { useCallback } from "react";
import { cn } from "@/lib/utils";
import Editor from "@monaco-editor/react";

interface CodePanelProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const languageColors: Record<string, string> = {
  HTML: "hsl(15, 85%, 60%)",
  CSS: "hsl(210, 85%, 60%)",
  JS: "hsl(50, 85%, 55%)",
};

const languageMap: Record<string, string> = {
  HTML: "html",
  CSS: "css",
  JS: "javascript",
};

const CodePanel = ({ language, value, onChange, className }: CodePanelProps) => {
  const handleChange = useCallback(
    (val: string | undefined) => {
      onChange(val ?? "");
    },
    [onChange]
  );

  return (
    <div className={cn("flex flex-col h-full min-h-0", className)}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50 bg-secondary/30 shrink-0">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: languageColors[language] }}
        />
        <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          {language}
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={languageMap[language] || "html"}
          theme="vs-dark"
          value={value}
          onChange={handleChange}
          options={{
            automaticLayout: true,
            wordWrap: "on",
            suggestOnTriggerCharacters: true,
            tabCompletion: "on",
            quickSuggestions: true,
            parameterHints: { enabled: true },
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            fontLigatures: true,
            lineHeight: 1.6,
            padding: { top: 8 },
            scrollBeyondLastLine: false,
            renderLineHighlight: "line",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true },
            hover: { enabled: true, delay: 300 },
            suggest: {
              showWords: true,
              showSnippets: true,
              preview: true,
            },
          }}
          loading={
            <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
              Loading editor…
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CodePanel;
