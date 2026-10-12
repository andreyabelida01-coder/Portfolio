"use client";

import Link from "next/link";
import { site } from "@/config/site";
import { DownloadIcon } from "@/components/icons";
import { useCompanion } from "@/components/companion/context";

const links = [
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const { active } = useCompanion();
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6" aria-label="Main">
        <Link href="#hero" className="flex items-center gap-2.5 font-display text-[1.05rem] font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg border border-line-strong bg-raise-2 text-[0.8rem] text-blue">
            {site.initials}
          </span>
          <span className="hidden sm:inline">{site.shortName}</span>
        </Link>
        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? "true" : undefined}
                className="rounded-lg px-3 py-2 text-[0.95rem] text-muted transition-colors duration-150 hover:text-text aria-[current=true]:text-text"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={site.resume}
          download="Andrey-Abelida-Resume.pdf"
          className="pressable ml-auto inline-flex items-center gap-2 rounded-lg border border-line-strong px-3.5 py-2 text-[0.92rem] font-medium hover:border-blue hover:text-blue md:ml-2"
        >
          <DownloadIcon size={16} />
          Resume
        </a>
      </nav>
    </header>
  );
}
