import { useState, useCallback, useRef, useEffect } from "react";
import {
  Project,
  ProjectMode,
  createEmptyProject,
  saveProjectToStorage,
  encodeProject,
} from "@/lib/projectEncoder";

export function useProject(initial?: Project) {
  const [project, setProject] = useState<Project>(initial || createEmptyProject());
  const [isSaved, setIsSaved] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const updateField = useCallback(
    (field: "html" | "css" | "js" | "name" | "mode", value: string) => {
      setProject((prev) => ({ ...prev, [field]: value, updatedAt: Date.now() }));
      setIsSaved(false);
    },
    []
  );

  const updateFile = useCallback((filename: string, content: string) => {
    setProject((prev) => ({
      ...prev,
      files: { ...(prev.files || {}), [filename]: content },
      updatedAt: Date.now(),
    }));
    setIsSaved(false);
  }, []);

  const addFile = useCallback((filename: string, content = "") => {
    setProject((prev) => ({
      ...prev,
      files: { ...(prev.files || {}), [filename]: content },
      updatedAt: Date.now(),
    }));
  }, []);

  const deleteFile = useCallback((filename: string) => {
    setProject((prev) => {
      const files = { ...(prev.files || {}) };
      delete files[filename];
      return { ...prev, files, updatedAt: Date.now() };
    });
  }, []);

  const switchMode = useCallback((mode: ProjectMode) => {
    setProject((prev) => {
      if (prev.mode === mode) return prev;
      const fresh = createEmptyProject(prev.name, mode);
      fresh.id = prev.id;
      fresh.packages = prev.packages;
      return fresh;
    });
  }, []);

  const addPackage = useCallback((pkg: string) => {
    setProject((prev) => ({
      ...prev,
      packages: prev.packages.includes(pkg) ? prev.packages : [...prev.packages, pkg],
      updatedAt: Date.now(),
    }));
  }, []);

  const removePackage = useCallback((pkg: string) => {
    setProject((prev) => ({
      ...prev,
      packages: prev.packages.filter((p) => p !== pkg),
      updatedAt: Date.now(),
    }));
  }, []);

  const save = useCallback(() => {
    saveProjectToStorage(project);
    setIsSaved(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsSaved(false), 2000);
  }, [project]);

  const getShareUrl = useCallback(() => {
    const encoded = encodeProject(project);
    return `${window.location.origin}/share/${encoded}`;
  }, [project]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    project,
    setProject,
    updateField,
    updateFile,
    addFile,
    deleteFile,
    switchMode,
    addPackage,
    removePackage,
    save,
    isSaved,
    getShareUrl,
  };
}
