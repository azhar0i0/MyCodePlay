import { Save, Share2, Home, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DeviceSimulator, { DeviceType } from "./DeviceSimulator";
import PackageImporter from "./PackageImporter";
import { useState } from "react";

interface ToolbarProps {
  projectName: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  isSaved: boolean;
  getShareUrl: () => string;
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  packages: string[];
  onAddPackage: (pkg: string) => void;
  onRemovePackage: (pkg: string) => void;
}

const Toolbar = ({
  projectName,
  onNameChange,
  onSave,
  isSaved,
  getShareUrl,
  device,
  onDeviceChange,
  packages,
  onAddPackage,
  onRemovePackage,
}: ToolbarProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = getShareUrl();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      </div>

      <div className="flex items-center gap-2">
        <PackageImporter packages={packages} onAdd={onAddPackage} onRemove={onRemovePackage} />
        <DeviceSimulator active={device} onChange={onDeviceChange} />

        <div className="w-px h-6 bg-border/50 mx-1 hidden sm:block" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          {isSaved ? <Check className="w-3.5 h-3.5 text-[hsl(140,70%,50%)]" /> : <Save className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          {copied ? <Copy className="w-3.5 h-3.5 text-[hsl(var(--gradient-end))]" /> : <Share2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
        </Button>
      </div>
    </header>
  );
};

export default Toolbar;
