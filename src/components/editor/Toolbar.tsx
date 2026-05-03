import { Home, Terminal, PanelLeftClose, PanelLeft, Eye, EyeOff, Atom, Code2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DeviceSimulator, { DeviceType } from "./DeviceSimulator";
import PackageImporter from "./PackageImporter";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ProjectMode } from "@/lib/projectEncoder";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  projectName: string;
  onNameChange: (name: string) => void;
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  packages: string[];
  onAddPackage: (pkg: string) => void;
  onRemovePackage: (pkg: string) => void;
  onRun: () => void;
  consoleOpen: boolean;
  onToggleConsole: () => void;
  codeVisible: boolean;
  onToggleCode: () => void;
  previewVisible: boolean;
  onTogglePreview: () => void;
  mode: ProjectMode;
  onModeChange: (mode: ProjectMode) => void;
}

const Toolbar = ({
  projectName,
  onNameChange,
  device,
  onDeviceChange,
  packages,
  onAddPackage,
  onRemovePackage,
  onRun,
  consoleOpen,
  onToggleConsole,
  codeVisible,
  onToggleCode,
  previewVisible,
  onTogglePreview,
  mode,
  onModeChange,
}: ToolbarProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-secondary/20 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-3">
        <Link to="/" className="shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] flex items-center justify-center hover:opacity-80 transition-opacity">
            <Home className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
        </Link>
        <input
          value={projectName}
          onChange={(e) => onNameChange(e.target.value)}
          className="bg-transparent text-sm font-semibold text-foreground focus:outline-none border-b border-transparent focus:border-primary/50 px-1 py-0.5 max-w-[200px]"
        />

        {/* Mode switcher */}
        <div className="flex items-center bg-secondary/40 rounded-lg p-0.5 border border-border/30">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onModeChange("vanilla")}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                  mode === "vanilla"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Code2 className="w-3 h-3" />
                <span className="hidden sm:inline">Vanilla</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>HTML / CSS / JS</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onModeChange("react")}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                  mode === "react"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Atom className="w-3 h-3" />
                <span className="hidden sm:inline">React</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>React + JSX</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              onClick={onRun}
              className="h-8 gap-1.5 text-xs font-semibold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-md shadow-emerald-500/20 border-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Run</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Run Code (Ctrl+Enter)</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border/50 mx-1 hidden sm:block" />

        <PackageImporter packages={packages} onAdd={onAddPackage} onRemove={onRemovePackage} />
        <DeviceSimulator active={device} onChange={onDeviceChange} />

        <div className="w-px h-6 bg-border/50 mx-1 hidden sm:block" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCode}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              {codeVisible ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{codeVisible ? "Hide Code" : "Show Code"}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePreview}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              {previewVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{previewVisible ? "Hide Preview" : "Show Preview"}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={consoleOpen ? "secondary" : "ghost"}
              size="sm"
              onClick={onToggleConsole}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">Console</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Console</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
};

export default Toolbar;
