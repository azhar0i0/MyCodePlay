import { useState } from "react";
import { Package, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface PackageImporterProps {
  packages: string[];
  onAdd: (pkg: string) => void;
  onRemove: (pkg: string) => void;
}

const PackageImporter = ({ packages, onAdd, onRemove }: PackageImporterProps) => {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const pkg = input.trim();
    if (pkg && !packages.includes(pkg)) {
      onAdd(pkg);
      setInput("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <Package className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Packages</span>
          {packages.length > 0 && (
            <span className="ml-1 text-[10px] bg-primary/20 text-primary rounded-full px-1.5 py-0.5 font-bold">
              {packages.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-border/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">NPM Packages</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Add packages loaded via unpkg CDN into your preview.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="e.g. lodash, axios, gsap"
            className="flex-1 bg-secondary/50 border-border/50"
          />
          <Button onClick={handleAdd} size="sm" className="px-3">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {packages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {packages.map((pkg) => (
              <span
                key={pkg}
                className="inline-flex items-center gap-1.5 text-xs bg-secondary/60 text-foreground rounded-full px-3 py-1.5 font-mono"
              >
                {pkg}
                <button
                  onClick={() => onRemove(pkg)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {packages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No packages added yet. Type a package name and press Enter.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PackageImporter;
