"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

/* --------------------------------------------------------------------------
   The applicant's journey: land -> home -> financing.

   Backed by sessionStorage so a refresh or a back-button trip doesn't lose the
   selections the summary panels read from. Exposed through
   useSyncExternalStore, which is the pattern React provides for reading
   browser state that the server cannot know about: the server and the first
   client render both see EMPTY, then React re-renders with the stored value
   once hydration is done. No effects, no hydration mismatch.
   -------------------------------------------------------------------------- */

export type LandOwnership = "own" | "third-party" | "help-me-find";

export type LandSelection = {
  ownership: LandOwnership;
  location: string;
  lotSize: string;
  titleStatus: string;
  registeredOwner: string;
};

export type HomeSelection = {
  id: string;
  code: string;
  name: string;
};

export type FinancingChoice = "own" | "bank";

export type FinancingSelection = {
  choice: FinancingChoice;
  institution?: string;
};

export type Journey = {
  land: LandSelection | null;
  home: HomeSelection | null;
  financing: FinancingSelection | null;
  reference: string | null;
};

const EMPTY: Journey = {
  land: null,
  home: null,
  financing: null,
  reference: null,
};

const STORAGE_KEY = "mkh.journey.v1";

/* ---------------------------------------------------------------- The store */

const listeners = new Set<() => void>();

/**
 * Cached snapshot. useSyncExternalStore compares snapshots by identity, so
 * this must only be replaced when the journey genuinely changes — returning a
 * fresh object on every read would loop forever.
 */
let snapshot: Journey = EMPTY;
let loaded = false;

function readStorage(): Journey {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Journey>) };
  } catch {
    // Private browsing, disabled storage, or corrupt JSON — start clean.
    return EMPTY;
  }
}

function getSnapshot(): Journey {
  if (!loaded) {
    snapshot = readStorage();
    loaded = true;
  }
  return snapshot;
}

/** The server has no session, so it always renders the empty journey. */
function getServerSnapshot(): Journey {
  return EMPTY;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function write(next: Journey) {
  snapshot = next;
  loaded = true;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable — the in-memory snapshot still carries the session.
  }
  listeners.forEach((listener) => listener());
}

/* ------------------------------------------------------------- The provider */

type JourneyContextValue = {
  journey: Journey;
  /** False during SSR and hydration, true once the browser value is in play. */
  hydrated: boolean;
  setLand: (land: LandSelection) => void;
  setHome: (home: HomeSelection) => void;
  setFinancing: (financing: FinancingSelection) => void;
  setReference: (reference: string) => void;
  reset: () => void;
};

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const journey = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const update = useCallback(
    (patch: Partial<Journey>) => write({ ...getSnapshot(), ...patch }),
    [],
  );

  const value = useMemo<JourneyContextValue>(
    () => ({
      journey,
      hydrated,
      setLand: (land) => update({ land }),
      setHome: (home) => update({ home }),
      setFinancing: (financing) => update({ financing }),
      setReference: (reference) => update({ reference }),
      reset: () => write(EMPTY),
    }),
    [journey, hydrated, update],
  );

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error("useJourney must be used inside a JourneyProvider");
  }
  return context;
}

/** Reference numbers follow MKH-<year>-<6 chars>, e.g. MKH-2026-4F9A2C. */
export function generateReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `MKH-${new Date().getFullYear()}-${suffix}`;
}
