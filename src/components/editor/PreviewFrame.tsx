import { useEffect, useRef, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import type { ConsoleEntry } from "./ConsolePanel";

interface PreviewFrameProps {
  html: string;
  css: string;
  js: string;
  packages: string[];
  width?: number;
  isUpdating?: boolean;
  onConsoleEntry?: (entry: ConsoleEntry) => void;
}

const PreviewFrame = ({ html, css, js, packages, width, isUpdating, onConsoleEntry }: PreviewFrameProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const srcdoc = useMemo(() => {
    const packageScripts = packages
      .map((pkg) => `<script src="https://unpkg.com/${pkg}"><\/script>`)
      .join("\n");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"><\/script>
  ${packageScripts}
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>
    // Override console methods to send to parent
    (function() {
      const origLog = console.log;
      const origWarn = console.warn;
      const origError = console.error;
      function send(type, args) {
        try {
          window.parent.postMessage({ __console: true, type: type, message: Array.from(args).map(function(a) { return typeof a === 'object' ? JSON.stringify(a) : String(a); }).join(' ') }, '*');
        } catch(e) {}
      }
      console.log = function() { send('log', arguments); origLog.apply(console, arguments); };
      console.warn = function() { send('warn', arguments); origWarn.apply(console, arguments); };
      console.error = function() { send('error', arguments); origError.apply(console, arguments); };
    })();

    window.onerror = function(msg, url, line) {
      window.parent.postMessage({ __console: true, type: 'error', message: msg + ' (line ' + line + ')' }, '*');
      document.body.innerHTML += '<div style="position:fixed;bottom:0;left:0;right:0;padding:12px 16px;background:#1e1e2e;color:#f87171;font-family:monospace;font-size:12px;border-top:2px solid #f87171;z-index:9999">' + msg + ' (line ' + line + ')</div>';
    };
    try { ${js} } catch(e) {
      window.parent.postMessage({ __console: true, type: 'error', message: e.message }, '*');
      document.body.innerHTML += '<div style="position:fixed;bottom:0;left:0;right:0;padding:12px 16px;background:#1e1e2e;color:#f87171;font-family:monospace;font-size:12px;border-top:2px solid #f87171;z-index:9999">' + e.message + '</div>';
    }
  <\/script>
</body>
</html>`;
  }, [html, css, js, packages]);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = srcdoc;
    }
  }, [srcdoc]);

  // Listen for console messages from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data && e.data.__console && onConsoleEntry) {
        onConsoleEntry({
          type: e.data.type,
          message: e.data.message,
          timestamp: Date.now(),
        });
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onConsoleEntry]);

  return (
    <div className="h-full w-full flex items-center justify-center bg-[hsl(230,25%,5%)] overflow-auto p-4 relative">
      {isUpdating && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50 text-[10px] text-muted-foreground font-medium">
          <Loader2 className="w-3 h-3 animate-spin" />
          Updating…
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="Preview"
        sandbox="allow-scripts allow-modals"
        className="bg-white rounded-lg shadow-2xl transition-all duration-500 ease-out"
        style={{
          width: width ? `${width}px` : "100%",
          height: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
          border: "none",
        }}
      />
    </div>
  );
};

export default PreviewFrame;
