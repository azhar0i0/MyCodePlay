import { useEffect, useRef, useMemo } from "react";

interface PreviewFrameProps {
  html: string;
  css: string;
  js: string;
  packages: string[];
  width?: number;
}

const PreviewFrame = ({ html, css, js, packages, width }: PreviewFrameProps) => {
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
  ${packageScripts}
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>
    window.onerror = function(msg, url, line) {
      document.body.innerHTML += '<div style="position:fixed;bottom:0;left:0;right:0;padding:12px 16px;background:#1e1e2e;color:#f87171;font-family:monospace;font-size:12px;border-top:2px solid #f87171;z-index:9999">' + msg + ' (line ' + line + ')</div>';
    };
    try { ${js} } catch(e) {
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

  return (
    <div className="h-full w-full flex items-center justify-center bg-[hsl(230,25%,5%)] overflow-auto p-4">
      <iframe
        ref={iframeRef}
        title="Preview"
        sandbox="allow-scripts allow-modals"
        className="bg-white rounded-lg shadow-2xl transition-all duration-500 ease-out"
        style={{
          width: width ? `${width}px` : "100%",
          height: width ? "100%" : "100%",
          maxWidth: "100%",
          maxHeight: "100%",
          border: "none",
        }}
      />
    </div>
  );
};

export default PreviewFrame;
