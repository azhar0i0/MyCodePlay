import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { bracketMatching, indentOnInput, syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { closeBrackets } from "@codemirror/autocomplete";

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

const getLanguageExtension = (lang: string) => {
  switch (lang) {
    case "HTML": return html();
    case "CSS": return css();
    case "JS": return javascript();
    default: return html();
  }
};

const CodePanel = ({ language, value, onChange, className }: CodePanelProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const initEditor = useCallback(() => {
    if (!editorRef.current) return;

    if (viewRef.current) {
      viewRef.current.destroy();
    }

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        bracketMatching(),
        closeBrackets(),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        getLanguageExtension(language),
        oneDark,
        keymap.of([...defaultKeymap, indentWithTab]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "13px",
            backgroundColor: "transparent",
          },
          ".cm-scroller": {
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: "1.6",
          },
          ".cm-gutters": {
            backgroundColor: "transparent",
            borderRight: "1px solid hsl(230 20% 18% / 0.5)",
            color: "hsl(215 20% 35%)",
          },
          ".cm-activeLineGutter": {
            backgroundColor: "transparent",
            color: "hsl(215 20% 55%)",
          },
          ".cm-activeLine": {
            backgroundColor: "hsl(230 25% 15% / 0.5)",
          },
          ".cm-cursor": {
            borderLeftColor: "hsl(262 83% 65%)",
          },
          ".cm-selectionBackground": {
            backgroundColor: "hsl(262 83% 65% / 0.2) !important",
          },
        }),
      ],
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    initEditor();
    return () => {
      viewRef.current?.destroy();
    };
  }, [initEditor]);

  // Sync external value changes (e.g. loading a project)
  useEffect(() => {
    const view = viewRef.current;
    if (view && view.state.doc.toString() !== value) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div className={cn("flex flex-col h-full min-h-0", className)}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50 bg-secondary/30 shrink-0">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: languageColors[language] }}
        />
        <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          {language}
        </span>
      </div>
      <div ref={editorRef} className="flex-1 min-h-0 overflow-auto" />
    </div>
  );
};

export default CodePanel;
