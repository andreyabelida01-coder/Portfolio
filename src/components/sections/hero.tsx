"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "@/config/site";
import { CompanionAnchor, CompanionSection } from "@/components/companion/context";
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { selectPath } from "@/components/path-events";

/**
 * Photo on the left, introduction on the right. Underneath, the hero's one moment: a signal
 * trace draws in, reaches a junction where Bit stands, and splits into the two paths.
 */
export function Hero() {
  return (
    <CompanionSection id="hero" className="relative mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-6 sm:pt-32">
      <div className="grid items-center gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:gap-20">
        <PhotoFrame />

        <div>
          <h1 className="font-display text-[clamp(2.6rem,6.4vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
            {site.name}
          </h1>
          <RoleLine />
          <p className="mt-6 max-w-[58ch] text-[1.08rem] leading-relaxed text-muted sm:text-[1.15rem]">{site.intro}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={site.resume}
              download="Andrey-Abelida-Resume.pdf"
              className="pressable inline-flex items-center gap-2 rounded-xl bg-blue px-5 py-3 font-medium text-blue-ink hover:bg-blue-hover"
            >
              <DownloadIcon size={18} />
              Download resume
            </a>
            <a
              href={`mailto:${site.email}`}
              className="pressable inline-flex items-center gap-2 rounded-xl border border-line-strong bg-raise px-5 py-3 font-medium hover:border-text"
            >
              <MailIcon size={18} />
              Email me
            </a>
            {site.links.github ? (
              <a
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="pressable grid size-12 place-items-center rounded-xl border border-line-strong bg-raise text-muted hover:border-text hover:text-text"
              >
                <GitHubIcon size={20} />
              </a>
            ) : null}
            {site.links.linkedin ? (
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                className="pressable grid size-12 place-items-center rounded-xl border border-line-strong bg-raise text-muted hover:border-text hover:text-text"
              >
                <LinkedInIcon size={20} />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <Trace />
    </CompanionSection>
  );
}

/**
 * The photo sits in a frame drawn like a chip package: pins down both sides and a
 * blue-to-green backplate for the two paths. The status tag is clipped onto the bottom edge.
 */
function PhotoFrame() {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(site.photo) && !failed;

  return (
    <div className="relative mx-auto w-full max-w-[290px] sm:max-w-[340px] md:mx-0 md:max-w-[400px]">
      <div
        aria-hidden
        className="absolute -inset-1 rotate-[5deg] rounded-[34px] bg-gradient-to-br from-blue via-[#2aa9c9] to-green"
      />
      <Pins side="left" />
      <Pins side="right" />

      <div className="relative aspect-[4/5] overflow-hidden rounded-[30px] border-[6px] border-raise bg-raise-2 shadow-[0_28px_60px_-24px_rgb(13_36_48/0.45)]">
        {showPhoto ? (
          <Image
            src={site.photo}
            alt={`Portrait of ${site.name}`}
            fill
            priority
            sizes="(min-width: 768px) 400px, 340px"
            className="object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            className="grid h-full w-full place-items-center"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 20%, var(--blue-soft), transparent 60%), radial-gradient(rgb(13 36 48 / 0.12) 1px, transparent 1px)",
              backgroundSize: "100% 100%, 16px 16px",
            }}
          >
            <span className="font-display text-[clamp(4rem,12vw,6.5rem)] font-semibold tracking-[-0.03em] text-blue">
              {site.initials}
            </span>
          </div>
        )}
      </div>

      <p className="absolute -bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl border border-line bg-raise px-4 py-3 shadow-[0_12px_30px_-12px_rgb(13_36_48/0.3)] sm:left-6 sm:right-auto">
        <span className="size-2.5 shrink-0 rounded-full bg-green shadow-[0_0_0_4px_var(--green-soft)]" aria-hidden />
        <span className="text-[0.9rem] leading-snug">
          <span className="block font-medium">Open to internships</span>
          <span className="block text-muted">Data analytics and software, {site.location.split(",")[0]}</span>
        </span>
      </p>
    </div>
  );
}

function Pins({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={`absolute top-1/2 flex -translate-y-1/2 flex-col gap-3.5 ${side === "left" ? "-left-3" : "-right-3"}`}
    >
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} className="block h-2.5 w-5 rounded-[3px] bg-line-strong" />
      ))}
    </div>
  );
}

/** Cycles through the roles in site.ts. Interrupting is fine: AnimatePresence swaps by key. */
function RoleLine() {
  const roles = site.roles;
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (roles.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), 2800);
    return () => window.clearInterval(id);
  }, [roles.length]);

  const role = roles[index];
  const color = role.tone === "software" ? "text-blue" : role.tone === "data" ? "text-green" : "text-text";

  return (
    <p className="mt-4 font-display text-[clamp(1.25rem,2.6vw,1.75rem)] font-semibold leading-tight">
      <span className="sr-only">{roles.map((r) => r.text).join(", ")}</span>
      <span aria-hidden className="relative block h-[1.3em] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={role.text}
            className={`absolute left-0 top-0 whitespace-nowrap ${color}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(45%)", filter: "blur(2px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, transform: "translateY(0%)", filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(-45%)", filter: "blur(2px)" }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
          >
            {role.text}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}

function Trace() {
  // Junction sits at 34% across; the SVG stretches horizontally, strokes stay 2px.
  return (
    <div className="relative mt-24 h-[200px] sm:mt-32 sm:h-[180px]">
      <svg
        className="trace-reveal absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 1000 180"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0 90 H340" stroke="var(--muted)" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      <svg
        className="trace-reveal trace-branches absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 1000 180"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M340 90 L380 30 H1000" stroke="var(--blue)" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
        <path d="M340 90 L380 150 H1000" stroke="var(--green)" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Junction pad */}
      <span
        className="trace-node absolute left-[34%] top-1/2 -ml-[7px] -mt-[7px] block size-[14px] rounded-full border-2 border-text bg-bg"
        aria-hidden
      />

      {/* Bit stands on the junction */}
      <CompanionAnchor
        id="hero"
        pose="wave"
        look="right"
        tone="software"
        say="Hi, I'm Bit. I'll walk you through Andrey's work."
        bubble="left"
        className="absolute bottom-1/2 left-[34%] -mb-[2px] h-[92px] w-[71px] -translate-x-1/2 sm:h-[112px] sm:w-[86px]"
      />

      <a
        href="#skills"
        onClick={() => selectPath("software")}
        className="trace-label absolute right-0 top-[16.6%] -translate-y-[calc(100%+8px)] text-right sm:left-[42%] sm:right-auto sm:text-left"
      >
        <span className="font-display text-[1.05rem] font-semibold text-blue sm:text-[1.2rem]">Software & full-stack</span>
        <span className="block text-[0.9rem] text-muted">React, Next.js, Node.js, Supabase</span>
      </a>
      <a
        href="#skills"
        onClick={() => selectPath("data")}
        className="trace-label absolute right-0 top-[83.3%] mt-2.5 text-right sm:left-[42%] sm:right-auto sm:text-left"
      >
        <span className="font-display text-[1.05rem] font-semibold text-green sm:text-[1.2rem]">Data analytics & hardware</span>
        <span className="block text-[0.9rem] text-muted">Excel, Sheets, SQL, Python, PySpark</span>
      </a>
    </div>
  );
}
