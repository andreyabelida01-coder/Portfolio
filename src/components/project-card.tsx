"use client";

import { useState } from "react";
import { categoryLabel, type Project } from "@/lib/types";
import { ExternalIcon } from "@/components/icons";

const tone = {
  fullstack: { text: "text-blue", border: "before:bg-blue" },
  data: { text: "text-green", border: "before:bg-green" },
} as const;

export function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const [broken, setBroken] = useState(false);
  const t = tone[project.category];
  const showImage = project.image && !broken;
  const host = project.siteName || safeHost(project.url);

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      className={`card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-raise transition-[border-color] duration-200 before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-[2px] ${t.border} ${
        large ? "lg:grid lg:grid-cols-[1.25fr_1fr]" : ""
      }`}
    >
      <div
        className={`card-media relative aspect-[1.91/1] overflow-hidden border-b border-line bg-raise-2 ${
          large ? "lg:aspect-auto lg:h-full lg:min-h-[17rem] lg:border-b-0 lg:border-r" : ""
        }`}
      >
        {showImage ? (
          // Images may come from any domain, so a plain img avoids an image-domain allowlist.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image!}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setBroken(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <Placeholder title={project.title} host={host} category={project.category} />
        )}
      </div>
      <div className={`flex flex-1 flex-col p-6 ${large ? "lg:p-8" : ""}`}>
        <div className="flex items-center justify-between gap-3 text-[0.9rem]">
          <span className={t.text}>{categoryLabel[project.category]}</span>
          <span className="inline-flex min-w-0 items-center gap-1.5 text-muted">
            <span className="truncate">{host}</span>
            <ExternalIcon size={14} className="shrink-0" />
          </span>
        </div>
        <h3 className={`mt-3 font-display font-semibold leading-tight ${large ? "text-[1.6rem]" : "text-[1.3rem]"}`}>
          {project.title}
        </h3>
        {project.description ? (
          <p className={`mt-2.5 text-[0.98rem] leading-relaxed text-muted ${large ? "line-clamp-5" : "line-clamp-3"}`}>
            {project.description}
          </p>
        ) : null}
        {project.tags.length ? (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-md border border-line px-2 py-0.5 text-[0.82rem] text-muted">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </a>
  );
}

/** Shown when a site has no preview image: a board-style tile with the project's initial. */
function Placeholder({ title, host, category }: { title: string; host: string; category: "fullstack" | "data" }) {
  const color = category === "data" ? "var(--green)" : "var(--blue)";
  return (
    <div
      className="relative flex h-full w-full items-center justify-center"
      style={{
        backgroundImage: `radial-gradient(circle at 30% 20%, color-mix(in oklab, ${color} 16%, transparent), transparent 60%), radial-gradient(rgb(143 170 182 / 0.14) 1px, transparent 1px)`,
        backgroundSize: "100% 100%, 16px 16px",
      }}
    >
      <span
        className="grid size-20 place-items-center rounded-2xl border-2 bg-bg font-display text-[2.4rem] font-semibold"
        style={{ borderColor: color, color }}
      >
        {title.trim().charAt(0).toUpperCase()}
      </span>
      <span className="absolute bottom-4 left-5 text-[0.85rem] text-muted">{host}</span>
    </div>
  );
}

function safeHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
