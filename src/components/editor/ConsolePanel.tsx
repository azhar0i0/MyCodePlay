import { useState, useEffect, useRef } from "react";
import { AlertTriangle, XCircle, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface ConsoleEntry {
  type: "log" | "error" | "warn";
  message: string;
  timestamp: number;
}

interface ConsolePanelProps {
  entries: ConsoleEntry[];
  onClear: () => void;
  isOpen: boolean;
}

const icons = {
  log: <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0" />,
  warn: <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />,
  error: <XCircle className="w-3.5 h-3.5 text-destructive shrink-0" />,
};

const entryColors = {
  log: "text-foreground/80",
  warn: "text-yellow-400",
  error: "text-destructive",
};

const ConsolePanel = ({ entries, onClear, isOpen }: ConsolePanelProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<"all" | "log" | "warn" | "error">("all");

  const filtered = filter === "all" ? entries : entries.filter((e) => e.type === filter);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 200, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="border-t border-border/50 bg-secondary/20 backdrop-blur-sm flex flex-col overflow-hidden"
        >
          {/* Console header */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/50 shrink-0">
            <div className="flex items-center gap-1">
              {(["all", "log", "warn", "error"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors",
                    filter === f
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={onClear} className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Console entries */}
          <div className="flex-1 overflow-auto p-2 space-y-0.5 code-font text-xs">
            {filtered.length === 0 && (
              <div className="text-muted-foreground/50 text-center py-4 text-[11px]">
                No console output
              </div>
            )}
            {filtered.map((entry, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2 px-2 py-1 rounded hover:bg-secondary/40 transition-colors",
                  entryColors[entry.type]
                )}
              >
                {icons[entry.type]}
                <span className="break-all leading-relaxed">{entry.message}</span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsolePanel;
