import { Smartphone, Tablet, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DeviceType = "mobile" | "tablet" | "desktop";

interface DeviceSimulatorProps {
  active: DeviceType;
  onChange: (device: DeviceType) => void;
}

const devices = [
  { type: "mobile" as DeviceType, icon: Smartphone, label: "Mobile", width: 375 },
  { type: "tablet" as DeviceType, icon: Tablet, label: "Tablet", width: 768 },
  { type: "desktop" as DeviceType, icon: Monitor, label: "Desktop", width: 0 },
];

export const deviceWidths: Record<DeviceType, number | undefined> = {
  mobile: 375,
  tablet: 768,
  desktop: undefined,
};

const DeviceSimulator = ({ active, onChange }: DeviceSimulatorProps) => {
  return (
    <div className="flex items-center gap-1 glass rounded-lg p-1">
      {devices.map((device) => (
        <Button
          key={device.type}
          variant="ghost"
          size="sm"
          onClick={() => onChange(device.type)}
          className={cn(
            "h-8 px-3 gap-1.5 text-xs rounded-md transition-all",
            active === device.type
              ? "bg-primary/20 text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <device.icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{device.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default DeviceSimulator;
