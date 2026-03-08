import { cn } from "@/lib/utils";

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

const CodePanel = ({ language, value, onChange, className }: CodePanelProps) => {
  return (
    <div className={cn("flex flex-col h-full min-h-0", className)}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 bg-secondary/30 shrink-0">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: languageColors[language] }}
        />
        <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          {language}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-h-0 w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
        spellCheck={false}
        placeholder={`Write your ${language} here...`}
      />
    </div>
  );
};

export default CodePanel;
