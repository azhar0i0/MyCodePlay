import { useState, useEffect, useRef, useCallback } from "react";
import { AlertTriangle, XCircle, Info, Trash2, Search, Copy, Clock, ChevronDown, ChevronUp, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
  log: <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />,
  warn: <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />,
  error: <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />,
};

const entryBg = {
  log: "hover:bg-blue-500/5",
  warn: "bg-yellow-500/5 hover:bg-yellow-500/10 border-l-2 border-yellow-500/30",
  error: "bg-red-500/5 hover:bg-red-500/10 border-l-2 border-red-500/30",
};

const entryColors = {
  log: "text-foreground/80",
  warn: "text-yellow-300",
  error: "text-red-400",
};

const ConsolePanel = ({ entries, onClear, isOpen }: ConsolePanelProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<"all" | "log" | "warn" | "error">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [fontSize, setFontSize] = useState(12);
  const [panelHeight, setPanelHeight] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const filtered = entries.filter((e) => {
    if (filter !== "all" && e.type !== filter) return false;
    if (searchQuery && !e.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const counts = {
    log: entries.filter((e) => e.type === "log").length,
    warn: entries.filter((e) => e.type === "warn").length,
    error: entries.filter((e) => e.type === "error").length,
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  const copyAll = useCallback(() => {
    const text = filtered.map((e) => {
      const ts = showTimestamps ? `[${new Date(e.timestamp).toLocaleTimeString()}] ` : "";
      return `${ts}[${e.type.toUpperCase()}] ${e.message}`;
    }).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Console output copied!");
  }, [filtered, showTimestamps]);

  const copyEntry = useCallback((entry: ConsoleEntry) => {
    navigator.clipboard.writeText(entry.message);
    toast.success("Copied!");
  }, []);

  // Drag-to-resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startY = e.clientY;
    const startHeight = panelHeight;

    const onMove = (ev: MouseEvent) => {
      const delta = startY - ev.clientY;
      setPanelHeight(Math.max(120, Math.min(600, startHeight + delta)));
    };
    const onUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [panelHeight]);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", fractionalSecondDigits: 3 } as any);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: panelHeight, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="border-t border-border/50 bg-[hsl(230,20%,8%)] flex flex-col overflow-hidden relative"
          style={{ height: isResizing ? panelHeight : undefined }}
        >
          {/* Resize handle */}
          <div
            onMouseDown={handleMouseDown}
            className={cn(
              "absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize z-10 group",
              "hover:bg-primary/30 transition-colors",
              isResizing && "bg-primary/40"
            )}
          >
            <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-muted-foreground/30 group-hover:bg-primary/60 transition-colors" />
          </div>

          {/* Console header */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/30 shrink-0 bg-[hsl(230,20%,10%)]">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-2">Console</span>
              {(["all", "log", "warn", "error"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md transition-all",
                    filter === f
                      ? f === "error" ? "bg-red-500/20 text-red-400"
                        : f === "warn" ? "bg-yellow-500/20 text-yellow-400"
                        : f === "log" ? "bg-blue-500/20 text-blue-400"
                        : "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  )}
                >
                  {f}
                  {f !== "all" && counts[f] > 0 && (
                    <span className="ml-1 text-[9px] opacity-70">({counts[f]})</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="sm" onClick={() => setShowSearch((v) => !v)} className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                <Search className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowTimestamps((v) => !v)} className={cn("h-6 w-6 p-0", showTimestamps ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
                <Clock className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings((v) => !v)} className={cn("h-6 w-6 p-0", showSettings ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
                <Settings2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={copyAll} className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                <Copy className="w-3.5 h-3.5" />
              </Button>
              <div className="w-px h-4 bg-border/30 mx-0.5" />
              <Button variant="ghost" size="sm" onClick={onClear} className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden border-b border-border/20"
              >
                <div className="px-3 py-1.5 flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter console output..."
                    className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                  />
                  {searchQuery && (
                    <span className="text-[10px] text-muted-foreground">{filtered.length} results</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Settings bar */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden border-b border-border/20"
              >
                <div className="px-3 py-1.5 flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                    Font Size
                    <input
                      type="range"
                      min={10}
                      max={16}
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-16 accent-primary"
                    />
                    <span className="text-foreground font-mono">{fontSize}px</span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Console entries */}
          <div className="flex-1 overflow-auto p-1.5 space-y-px font-mono" style={{ fontSize: `${fontSize}px` }}>
            {filtered.length === 0 && (
              <div className="text-muted-foreground/40 text-center py-8 text-[11px] select-none">
                {searchQuery ? "No matching entries" : "No console output"}
              </div>
            )}
            {filtered.map((entry, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2 px-2 py-1 rounded transition-colors group cursor-default",
                  entryBg[entry.type],
                  entryColors[entry.type]
                )}
                onDoubleClick={() => copyEntry(entry)}
              >
                {icons[entry.type]}
                {showTimestamps && (
                  <span className="text-muted-foreground/40 shrink-0 tabular-nums" style={{ fontSize: `${fontSize - 1}px` }}>
                    {formatTime(entry.timestamp)}
                  </span>
                )}
                <span className="break-all leading-relaxed flex-1">{entry.message}</span>
                <button
                  onClick={() => copyEntry(entry)}
                  className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity shrink-0"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-3 py-1 border-t border-border/20 text-[9px] text-muted-foreground/50 shrink-0 bg-[hsl(230,20%,7%)]">
            <span>{entries.length} entries</span>
            <span>Double-click to copy • Drag top edge to resize</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsolePanel;
