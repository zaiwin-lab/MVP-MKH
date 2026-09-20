"use client";

import { useSyncExternalStore } from "react";

/* --------------------------------------------------------------------------
   Express theme — dark or bright.

   The attribute lives on <html> rather than on the React root so an inline
   script can set it before first paint; otherwise a customer who chose bright
   gets a dark flash on every load. React only ever reads it back, which is
   why this is an external store and not component state. The same rule the
   journey state follows: don't read storage with useEffect + setState.
   -------------------------------------------------------------------------- */

export type ExTheme = "dark" | "bright";

export const THEME_KEY = "mkh.express.theme";
export const THEME_ATTR = "data-ex-theme";

/** Dark is the prerendered default, so it is also the server snapshot. */
export const DEFAULT_THEME: ExTheme = "dark";

/** CSS keys off "light"; the customer-facing word for it is "bright". */
function attrValue(theme: ExTheme) {
  return theme === "bright" ? "light" : "dark";
}

/**
 * Runs before paint, from an inline script in the page. Kept as a string
 * because it must execute ahead of the bundle, not with it.
 */
export const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)});document.documentElement.setAttribute(${JSON.stringify(
  THEME_ATTR,
)},t==="bright"?"light":"dark");}catch(e){}})();`;

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ExTheme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  return document.documentElement.getAttribute(THEME_ATTR) === "light"
    ? "bright"
    : "dark";
}

function getServerSnapshot(): ExTheme {
  return DEFAULT_THEME;
}

export function setExTheme(theme: ExTheme) {
  document.documentElement.setAttribute(THEME_ATTR, attrValue(theme));
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* Private browsing with storage blocked: the choice holds for this page. */
  }
  for (const listener of listeners) listener();
}

export function useExTheme(): [ExTheme, (theme: ExTheme) => void] {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return [theme, setExTheme];
}
