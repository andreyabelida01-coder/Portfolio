"use client";

import { site } from "@/config/site";
import { CompanionAnchor, CompanionSection } from "@/components/companion/context";
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { selectPath } from "@/components/path-events";

/**
 * The hero's one moment: a signal trace draws in, reaches a junction where Bit stands,
 * and splits into the two paths this portfolio is organised around.
 */
export function Hero() {
  return (
    <CompanionSection id="hero" className="relative mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6 sm:pt-32">
      <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-raise/70 py-1.5 pl-3 pr-4 text-[0.92rem] text-muted">
        <span className="size-2 rounded-full bg-green shadow-[0_0_8px_var(--green)]" aria-hidden />
        {site.availability}, based in {site.location.split(",")[0]}
      </p>
      <h1 className="mt-5 max-w-[13ch] font-display text-[clamp(2.9rem,9vw,6.4rem)] font-semibold leading-[0.94] tracking-[-0.02em]">
        {site.name}
      </h1>
      <p className="mt-7 max-w-[60ch] text-[1.125rem] leading-relaxed text-muted sm:text-[1.2rem]">{site.intro}</p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <a
          href={site.resume}
          download="Andrey-Abelida-Resume.pdf"
          className="pressable inline-flex items-center gap-2 rounded-xl bg-blue px-5 py-3 font-medium text-blue-ink hover:bg-[#7dd6ff]"
        >
          <DownloadIcon size={18} />
          Download resume
        </a>
        <a
          href={`mailto:${site.email}`}
          className="pressable inline-flex items-center gap-2 rounded-xl border border-line-strong px-5 py-3 font-medium hover:border-text"
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
            className="pressable grid size-12 place-items-center rounded-xl border border-line-strong text-muted hover:border-text hover:text-text"
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
            className="pressable grid size-12 place-items-center rounded-xl border border-line-strong text-muted hover:border-text hover:text-text"
          >
            <LinkedInIcon size={20} />
          </a>
        ) : null}
      </div>

      <Trace />
    </CompanionSection>
  );
}

function Trace() {
  // Junction sits at 34% across; the SVG stretches horizontally, strokes stay 2px.
  return (
    <div className="relative mt-14 h-[200px] sm:mt-16 sm:h-[180px]">
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
        className="absolute bottom-1/2 left-[34%] mb-[5px] h-[80px] w-[72px] -translate-x-1/2 sm:h-[96px] sm:w-[86px]"
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
