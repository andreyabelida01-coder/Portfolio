"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Path } from "@/config/site";
import { BitMascot } from "./bit-mascot";
import { useCompanion, type AnchorEntry, type Look, type Pose } from "./context";

/**
 * Bit floats in a fixed layer above the page and follows the anchor of the section being read.
 * When the reader moves to a new section, Bit breaks into particles, the particles stream to the
 * next anchor, and Bit reassembles there.
 *
 * Performance notes (from the animation reference):
 * - Tracking writes `transform` straight to the element on scroll; React never re-renders per frame.
 * - Particles and the dissolve run on WAAPI with transform/opacity, so they stay smooth while
 *   the page is busy. Blur stays at 4px.
 */

const PARTICLES = 18;
const NAV_CLEARANCE = 76;
const EDGE = 12;

const TONE: Record<Path, string> = { software: "var(--blue)", data: "var(--green)" };

type Box = { x: number; y: number; w: number; h: number };

function clampBox(rect: DOMRect): Box {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = rect.width;
  const h = rect.height;
  const y = Math.min(Math.max(rect.top, NAV_CLEARANCE), vh - h - EDGE);
  // Stay near the reader: if the anchor scrolls off screen, dock at the right edge, where the
  // page margin is, and wait there until the anchor comes back.
  const offscreen = rect.top < NAV_CLEARANCE || rect.bottom > vh - EDGE;
  const x = offscreen ? vw - w - EDGE : Math.min(Math.max(rect.left, EDGE), vw - w - EDGE);
  return { x, y, w, h };
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function Companion() {
  const { active, anchors, toneVersion, anchorVersion } = useCompanion();
  const reduce = useReducedMotion();

  const wrapRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const running = useRef<Animation[]>([]);
  const travelling = useRef(false);
  const currentId = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  const [pose, setPose] = useState<Pose>("wave");
  const [look, setLook] = useState<Look>("center");
  const [tone, setTone] = useState<Path>("software");
  const [say, setSay] = useState<string | undefined>();
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [bubbleSide, setBubbleSide] = useState<"left" | "right">("right");
  const [ready, setReady] = useState(false);

  const anchorFor = useCallback((id: string | null): AnchorEntry | undefined => {
    if (!id) return undefined;
    const entry = anchors.current.get(id);
    if (!entry || !entry.el.isConnected) return undefined;
    const rect = entry.el.getBoundingClientRect();
    return rect.width > 0 ? entry : undefined;
  }, [anchors]);

  /** Moves Bit onto its current anchor. Runs on scroll/resize, outside React. */
  const place = useCallback(() => {
    const wrap = wrapRef.current;
    const entry = anchorFor(currentId.current);
    if (!wrap || !entry || travelling.current) return;
    const box = clampBox(entry.el.getBoundingClientRect());
    wrap.style.transform = `translate3d(${box.x}px, ${box.y}px, 0)`;
    if (wrap.offsetWidth !== Math.round(box.w)) {
      wrap.style.width = `${box.w}px`;
      wrap.style.height = `${box.h}px`;
    }
    setBubbleSide(entry.bubble ?? (box.x + box.w / 2 > window.innerWidth * 0.6 ? "left" : "right"));
  }, [anchorFor]);

  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), place()));
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
    };
  }, [place]);

  // When anchors mount or move (filtering projects, layout animations), follow them for a moment.
  useEffect(() => {
    if (!ready) return;
    let frame = 0;
    const until = performance.now() + 600;
    const loop = () => {
      place();
      if (performance.now() < until) frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [anchorVersion, ready, place]);

  const clearPending = () => {
    running.current.forEach((a) => a.cancel());
    running.current = [];
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const arrive = useCallback(
    (entry: AnchorEntry) => {
      setPose(entry.pose);
      setLook(entry.look ?? "center");
      setTone(entry.tone ?? "software");
      setSay(entry.say);
      // On phones the bubble would cover the content; there it opens on tap instead.
      setBubbleOpen(Boolean(entry.say) && window.matchMedia("(min-width: 768px)").matches);
      timers.current.push(window.setTimeout(() => setBubbleOpen(false), 5200));
    },
    [],
  );

  /** Dissolve here, stream across, reassemble at the target anchor. */
  const travel = useCallback(
    (toId: string, first: boolean) => {
      const wrap = wrapRef.current;
      const body = bodyRef.current;
      const entry = anchorFor(toId);
      if (!wrap || !body || !entry) return;

      clearPending();
      setBubbleOpen(false);
      currentId.current = toId;
      const target = clampBox(entry.el.getBoundingClientRect());

      if (reduce) {
        // Reduced motion: no movement, just a quick crossfade in place.
        const out = body.animate([{ opacity: 1 }, { opacity: 0 }], { duration: first ? 0 : 150, fill: "forwards" });
        running.current.push(out);
        out.finished
          .then(() => {
            travelling.current = false;
            place();
            arrive(entry);
            running.current.push(body.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: "forwards" }));
          })
          .catch(() => {});
        return;
      }

      const from = first
        ? { x: target.x - 40, y: target.y - 30, w: target.w + 80, h: target.h + 60 }
        : (() => {
            const r = wrap.getBoundingClientRect();
            return { x: r.left, y: r.top, w: r.width, h: r.height };
          })();

      travelling.current = true;

      // 1. Dissolve the body.
      if (!first) {
        running.current.push(
          body.animate(
            [
              { opacity: 1, transform: "scale(1)", filter: "blur(0px)" },
              { opacity: 0, transform: "scale(0.9)", filter: "blur(4px)" },
            ],
            { duration: 220, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" },
          ),
        );
      } else {
        body.style.opacity = "0";
      }

      // 2. Particles scatter, then stream along a curve to the target.
      const dx = target.x - from.x;
      const dy = target.y - from.y;
      const distance = Math.hypot(dx, dy);
      const duration = first ? 700 : Math.min(950, 620 + distance * 0.25);
      let longest = 0;

      particleRefs.current.forEach((p, i) => {
        if (!p) return;
        const sx = from.x + rand(0.2, 0.8) * from.w;
        const sy = from.y + rand(0.15, 0.85) * from.h;
        const angle = rand(0, Math.PI * 2);
        const spread = first ? 0 : rand(14, 36);
        const mx = sx + Math.cos(angle) * spread;
        const my = sy + Math.sin(angle) * spread;
        const ex = target.x + rand(0.25, 0.75) * target.w;
        const ey = target.y + rand(0.2, 0.8) * target.h;
        // Bend the path sideways so the stream reads as travel, not a teleport.
        const bend = (distance > 1 ? rand(-0.35, 0.35) : 0) * distance;
        const nx = distance > 1 ? -dy / distance : 0;
        const ny = distance > 1 ? dx / distance : 0;
        const cx = (mx + ex) / 2 + nx * bend;
        const cy = (my + ey) / 2 + ny * bend;
        const delay = i * 16;
        const t = (x: number, y: number, s: number) => `translate3d(${x}px, ${y}px, 0) scale(${s})`;

        const anim = p.animate(
          [
            { transform: t(sx, sy, 0.5), opacity: 0, offset: 0 },
            { transform: t(sx, sy, 1), opacity: 1, offset: 0.1 },
            { transform: t(mx, my, 1), opacity: 1, offset: 0.28 },
            { transform: t(cx, cy, 0.9), opacity: 0.9, offset: 0.62 },
            { transform: t(ex, ey, 0.6), opacity: 0, offset: 1 },
          ],
          { duration, delay, easing: "cubic-bezier(0.77, 0, 0.175, 1)", fill: "both" },
        );
        running.current.push(anim);
        longest = Math.max(longest, duration + delay);
      });

      // 3. Reassemble as the particles land.
      timers.current.push(
        window.setTimeout(() => {
          travelling.current = false;
          place();
          arrive(entry);
          body.style.opacity = "";
          running.current.push(
            body.animate(
              [
                { opacity: 0, transform: "scale(0.92)", filter: "blur(4px)" },
                { opacity: 1, transform: "scale(1)", filter: "blur(0px)" },
              ],
              { duration: 280, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" },
            ),
          );
        }, longest * 0.82),
      );
    },
    [anchorFor, arrive, place, reduce],
  );

  // First appearance: wait for layout and fonts so the hero anchor is in its final spot.
  useLayoutEffect(() => {
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      setReady(true);
    };
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    const delay = window.setTimeout(() => (fonts ? fonts.ready.then(start) : start()), 450);
    return () => {
      cancelled = true;
      window.clearTimeout(delay);
    };
    // Runs once on mount.
  }, []);

  // Later section changes.
  useEffect(() => {
    if (!ready || currentId.current === active) return;
    travel(active, currentId.current === null);
  }, [active, ready, travel]);

  // A section can recolor Bit while it stays put (the skills switch).
  useEffect(() => {
    const entry = anchorFor(currentId.current);
    if (entry?.tone && !travelling.current) setTone(entry.tone);
  }, [toneVersion, anchorFor]);

  useEffect(() => () => clearPending(), []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      aria-hidden
      style={{ ["--bit-accent" as string]: TONE[tone] }}
    >
      {Array.from({ length: PARTICLES }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            particleRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 block size-[6px] rounded-[2px] opacity-0"
          style={{
            background: i % 5 === 0 ? "var(--text)" : "var(--bit-accent)",
            boxShadow: "0 0 8px var(--bit-accent)",
          }}
        />
      ))}

      <div
        ref={wrapRef}
        className="bit-hit pointer-events-auto absolute left-0 top-0 h-[96px] w-[86px]"
        style={{ transform: "translate3d(-200px, -200px, 0)", visibility: ready ? "visible" : "hidden" }}
        onPointerEnter={() => say && setBubbleOpen(true)}
        onPointerLeave={() => setBubbleOpen(false)}
        onClick={() => say && setBubbleOpen((open) => !open)}
      >
        <div ref={bodyRef} className="h-full w-full" style={{ opacity: 0 }}>
          <div className="bit-float h-full w-full">
            <div className="bit-body h-full w-full">
              <BitMascot pose={pose} look={look} />
            </div>
          </div>
        </div>

        {say ? (
          <div
            data-open={bubbleOpen}
            className={`bit-bubble absolute bottom-[calc(100%+6px)] w-max max-w-[15rem] rounded-xl border border-line-strong bg-raise-2 px-3 py-2 text-[0.8125rem] leading-snug text-text shadow-[0_8px_24px_rgb(0_0_0/0.35)] ${
              bubbleSide === "left" ? "right-1/2 origin-bottom-right" : "left-1/2 origin-bottom-left"
            }`}
          >
            {say}
          </div>
        ) : null}
      </div>
    </div>
  );
}
