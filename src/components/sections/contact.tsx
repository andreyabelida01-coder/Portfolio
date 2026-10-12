"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { CompanionAnchor, CompanionSection } from "@/components/companion/context";
import { CheckIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { SectionHeading } from "./section-heading";

const subject = encodeURIComponent("Internship opportunity");

export function Contact() {
  return (
    <CompanionSection id="contact" className="mx-auto max-w-6xl px-4 pb-32 pt-24 sm:px-6">
      <SectionHeading
        title="Contact"
        lead="Hiring for an internship, or want a walkthrough of a project? Email is the fastest way to reach me."
      />

      <div className="relative mt-12 rounded-2xl border border-line bg-raise p-6 sm:p-10">
        <a
          href={`mailto:${site.email}?subject=${subject}`}
          className="group inline-block max-w-full font-display text-[clamp(1.35rem,4.2vw,2.6rem)] font-semibold leading-tight tracking-[-0.01em] break-words hover:text-blue"
        >
          {site.email}
        </a>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:${site.email}?subject=${subject}`}
            className="pressable inline-flex items-center gap-2 rounded-xl bg-blue px-5 py-3 font-medium text-blue-ink hover:bg-[#7dd6ff]"
          >
            <MailIcon size={18} />
            Write an email
          </a>
          <CopyEmail />
          <a
            href={`tel:${site.phone}`}
            className="pressable inline-flex items-center gap-2 rounded-xl border border-line-strong px-5 py-3 font-medium hover:border-text"
          >
            <PhoneIcon size={18} className="text-green" />
            {site.phone}
          </a>
        </div>

        <div className="mt-10 flex items-end justify-between gap-4 border-t border-line pt-8">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <a
              href={site.resume}
              download="Andrey-Abelida-Resume.pdf"
              className="pressable inline-flex items-center gap-2 rounded-xl border border-line-strong px-4 py-2.5 font-medium hover:border-text"
            >
              <DownloadIcon size={17} />
              Resume (PDF)
            </a>
            {site.links.github ? (
              <a
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
                className="pressable inline-flex items-center gap-2 rounded-xl border border-line-strong px-4 py-2.5 font-medium hover:border-text"
              >
                <GitHubIcon size={17} />
                GitHub
              </a>
            ) : null}
            {site.links.linkedin ? (
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="pressable inline-flex items-center gap-2 rounded-xl border border-line-strong px-4 py-2.5 font-medium hover:border-text"
              >
                <LinkedInIcon size={17} />
                LinkedIn
              </a>
            ) : null}
            <p className="w-full pt-2 text-[0.95rem] text-muted">
              Based in Manila. Available for on-site, hybrid or remote internships.
            </p>
          </div>
          <CompanionAnchor
            id="contact"
            pose="rest"
            look="left"
            tone="data"
            say="Andrey usually replies within two days."
            bubble="left"
            className="h-[80px] w-[72px] shrink-0 sm:h-[96px] sm:w-[86px]"
          />
        </div>
      </div>
    </CompanionSection>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(site.email);
          setCopied(true);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setCopied(false), 1800);
        } catch {
          window.location.href = `mailto:${site.email}`;
        }
      }}
      className="pressable inline-flex items-center gap-2 rounded-xl border border-line-strong px-5 py-3 font-medium hover:border-text"
    >
      {copied ? <CheckIcon size={18} className="text-green" /> : <MailIcon size={18} className="text-muted" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
