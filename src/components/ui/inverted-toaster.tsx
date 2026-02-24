"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sileo";
import { useEffect, useState } from "react";

export function InvertedToaster() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // User requirement:
  // Dark Mode -> White BG (Light Theme)
  // Light Mode -> Dark BG (Dark Theme)
  const invertedTheme = resolvedTheme === "dark" ? "light" : "dark";

  return <Toaster position="top-right" theme={invertedTheme} />;
}
