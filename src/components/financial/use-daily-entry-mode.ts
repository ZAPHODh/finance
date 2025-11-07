"use client";

import { useState, useEffect } from "react";

type DailyEntryMode = "quick" | "complete";

const STORAGE_KEY = "preferredDailyEntryMode";

export function useDailyEntryMode(initialMode: DailyEntryMode = "quick") {
  const [mode, setMode] = useState<DailyEntryMode>(initialMode);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as DailyEntryMode | null;
    if (stored === "quick" || stored === "complete") {
      setMode(stored);
    }
  }, []);

  function toggleMode() {
    setMode((prev) => {
      const newMode = prev === "quick" ? "complete" : "quick";
      localStorage.setItem(STORAGE_KEY, newMode);
      return newMode;
    });
  }

  function setModeAndPersist(newMode: DailyEntryMode) {
    setMode(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  }

  return {
    mode,
    toggleMode,
    setMode: setModeAndPersist,
    isQuick: mode === "quick",
    isComplete: mode === "complete",
  };
}
