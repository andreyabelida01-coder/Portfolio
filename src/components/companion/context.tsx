"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Path } from "@/config/site";

export type Pose = "wave" | "point-left" | "point-right" | "sit" | "rest";
export type Look = "left" | "right" | "down" | "center";

export type AnchorSpec = {
  pose: Pose;
  look?: Look;
  tone?: Path;
  /** What Bit says on arrival. Keep it short. */
  say?: string;
  /** Which side of Bit the speech bubble opens toward. Defaults to the roomier side. */
  bubble?: "left" | "right";
};

export type AnchorEntry = AnchorSpec & { el: HTMLElement };

type CompanionContextValue = {
  active: string;
  anchors: React.RefObject<Map<string, AnchorEntry>>;
  /** Pass `null` with the element to unregister; only that element's registration is removed. */
  registerAnchor: (id: string, entry: AnchorEntry | null, el?: HTMLElement) => void;
  registerSection: (id: string, el: HTMLElement | null) => void;
  /** Lets a section change Bit's color while it's there (the skills switch does this). */
  setTone: (id: string, tone: Path) => void;
  toneVersion: number;
  /** Bumps whenever an anchor mounts or unmounts, so Bit can re-measure. */
  anchorVersion: number;
};

const CompanionContext = createContext<CompanionContextValue | null>(null);

export function useCompanion() {
  const ctx = useContext(CompanionContext);
  if (!ctx) throw new Error("useCompanion must be used inside CompanionProvider");
  return ctx;
}

/** Tracks which section is in the middle of the viewport and where each section's anchor is. */
export function CompanionProvider({ children, initial = "hero" }: { children: ReactNode; initial?: string }) {
  const anchors = useRef(new Map<string, AnchorEntry>());
  const sections = useRef(new Map<string, HTMLElement>());
  const [active, setActive] = useState(initial);
  const [toneVersion, setToneVersion] = useState(0);
  const [anchorVersion, setAnchorVersion] = useState(0);

  // The section crossing a reading line 45% down the screen is the one being read.
  // Near the bottom of the page the last section wins, since it may never reach the line.
  const pickActive = useCallback(() => {
    const line = window.innerHeight * 0.45;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    let found = "";
    let last = "";
    let lastTop = -Infinity;
    for (const [id, el] of sections.current) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= line && rect.bottom > line) found = id;
      if (rect.top > lastTop) {
        lastTop = rect.top;
        last = id;
      }
    }
    const next = atBottom ? last : found;
    if (next) setActive(next);
  }, []);

  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), pickActive()));
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pickActive]);

  const registerSection = useCallback((id: string, el: HTMLElement | null) => {
    if (el) sections.current.set(id, el);
    else sections.current.delete(id);
  }, []);

  const registerAnchor = useCallback((id: string, entry: AnchorEntry | null, el?: HTMLElement) => {
    if (entry) anchors.current.set(id, entry);
    else if (anchors.current.get(id)?.el === el) anchors.current.delete(id);
    setAnchorVersion((v) => v + 1);
  }, []);

  const setTone = useCallback((id: string, tone: Path) => {
    const entry = anchors.current.get(id);
    if (entry && entry.tone !== tone) {
      entry.tone = tone;
      setToneVersion((v) => v + 1);
    }
  }, []);

  const value = useMemo(
    () => ({ active, anchors, registerAnchor, registerSection, setTone, toneVersion, anchorVersion }),
    [active, registerAnchor, registerSection, setTone, toneVersion, anchorVersion],
  );

  return <CompanionContext value={value}>{children}</CompanionContext>;
}

/** A spot reserved in the layout for Bit to stand in. Size it with className. */
export function CompanionAnchor({
  id,
  className,
  ...spec
}: AnchorSpec & { id: string; className?: string }) {
  const { registerAnchor } = useCompanion();
  const ref = useRef<HTMLDivElement>(null);
  const { pose, look, tone, say, bubble } = spec;

  useLayoutEffect(() => {
    if (!ref.current) return;
    const existing = ref.current;
    registerAnchor(id, { el: existing, pose, look, tone, say, bubble });
    return () => registerAnchor(id, null, existing);
    // tone is registered once; later changes go through setTone so Bit can react.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, pose, look, say, bubble, registerAnchor]);

  return <div ref={ref} aria-hidden className={className} data-companion-anchor={id} />;
}

/** Marks a page section so Bit knows when the reader has reached it. */
export function CompanionSection({
  id,
  className,
  children,
  ...rest
}: { id: string; className?: string; children: ReactNode } & React.HTMLAttributes<HTMLElement>) {
  const { registerSection } = useCompanion();
  const ref = useCallback((el: HTMLElement | null) => registerSection(id, el), [id, registerSection]);
  return (
    <section ref={ref} id={id} data-companion-section={id} className={className} {...rest}>
      {children}
    </section>
  );
}
