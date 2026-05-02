import { useEffect, useRef, useMemo } from "react";
import { Loader2 } from "lucide-react";
import type { ConsoleEntry } from "./ConsolePanel";

interface ReactPreviewFrameProps {
  files: Record<string, string>;
  packages: string[];
  width?: number;
  isUpdating?: boolean;
  onConsoleEntry?: (entry: ConsoleEntry) => void;
}

const ReactPreviewFrame = ({ files, packages, width, isUpdating, onConsoleEntry }: ReactPreviewFrameProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const srcdoc = useMemo(() => {
    const appJsx = files["App.jsx"] || "";
    const stylesCSS = files["styles.css"] || "";

    // Collect extra component files (not App.jsx, index.jsx, styles.css)
    const componentFiles = Object.entries(files).filter(
      ([name]) => name !== "App.jsx" && name !== "index.jsx" && name !== "styles.css" && (name.endsWith(".jsx") || name.endsWith(".js"))
    );

    const packageScripts = packages
      .filter((p) => p !== "react" && p !== "react-dom")
      .map((pkg) => `<script src="https://unpkg.com/${pkg}"><\/script>`)
      .join("\n");

    // Build a module registry for imports
    const componentModules = componentFiles.map(([name, code]) => {
      const moduleName = "./" + name.replace(/\.(jsx|js)$/, "");
      return `
      __modules["${moduleName}"] = (function() {
        const exports = {};
        const module = { exports };
        try {
          const code = Babel.transform(${JSON.stringify(code)}, {
            presets: [["env", { modules: "commonjs" }], "react"],
            filename: "${name}"
          }).code;
          const fn = new Function("require", "exports", "module", "React", "useState", "useEffect", "useRef", "useCallback", "useMemo", "useContext", "useReducer", code);
          fn(__require, exports, module, React, React.useState, React.useEffect, React.useRef, React.useCallback, React.useMemo, React.useContext, React.useReducer);
        } catch(e) {
          console.error("Error in ${name}:", e.message);
        }
        return module.exports.default || module.exports;
      })();`;
    }).join("\n");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  ${packageScripts}
  <style>${stylesCSS}</style>
</head>
<body>
  <div id="root"></div>
  <script>
    // Console forwarding
    (function() {
      const origLog = console.log;
      const origWarn = console.warn;
      const origError = console.error;
      function send(type, args) {
        try {
          window.parent.postMessage({ __console: true, type, message: Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
        } catch(e) {}
      }
      console.log = function() { send('log', arguments); origLog.apply(console, arguments); };
      console.warn = function() { send('warn', arguments); origWarn.apply(console, arguments); };
      console.error = function() { send('error', arguments); origError.apply(console, arguments); };
    })();

    window.onerror = function(msg, url, line) {
      window.parent.postMessage({ __console: true, type: 'error', message: msg + ' (line ' + line + ')' }, '*');
    };

    // Simple module system
    const __modules = {};
    function __require(name) {
      if (name === 'react') return React;
      if (name === 'react-dom/client') return ReactDOM;
      if (name === 'react-dom') return ReactDOM;
      if (__modules[name]) return __modules[name];
      // Try without ./
      const alt = name.startsWith('./') ? name : './' + name;
      if (__modules[alt]) return __modules[alt];
      console.warn('Module not found: ' + name);
      return {};
    }

    try {
      // Register component modules
      ${componentModules}

      // Transpile App.jsx
      const appCode = Babel.transform(${JSON.stringify(appJsx)}, {
        presets: [["env", { modules: "commonjs" }], "react"],
        filename: "App.jsx"
      }).code;

      const appExports = {};
      const appModule = { exports: appExports };
      const appFn = new Function("require", "exports", "module", "React", "useState", "useEffect", "useRef", "useCallback", "useMemo", "useContext", "useReducer", appCode);
      appFn(__require, appExports, appModule, React, React.useState, React.useEffect, React.useRef, React.useCallback, React.useMemo, React.useContext, React.useReducer);
      
      const App = appModule.exports.default || appModule.exports;
      
      // Render
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    } catch(e) {
      console.error(e.message);
      document.getElementById('root').innerHTML = '<div style="padding:24px;font-family:monospace;color:#f87171;background:#1e1e2e;min-height:100vh;white-space:pre-wrap"><strong>Error:</strong> ' + e.message + '</div>';
    }
  <\/script>
</body>
</html>`;
  }, [files, packages]);

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
          Compiling…
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="React Preview"
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

export default ReactPreviewFrame;
