"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { categoryLabel, type Category, type Project } from "@/lib/types";
import { ProjectCard } from "@/components/project-card";
import { CompanionAnchor } from "@/components/companion/context";
import { site } from "@/config/site";

type Filter = "all" | Category;

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const reduce = useReducedMotion();
  const shown = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const counts = {
    all: projects.length,
    fullstack: projects.filter((p) => p.category === "fullstack").length,
    data: projects.filter((p) => p.category === "data").length,
  };

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "fullstack", label: categoryLabel.fullstack },
    { id: "data", label: categoryLabel.data },
  ];

  if (projects.length === 0) {
    return (
      <div className="relative mt-12 rounded-2xl border border-dashed border-line-strong p-10">
        <CompanionAnchor
          id="projects"
          pose="sit"
          look="down"
          tone="software"
          say="Projects are on the way."
          className="absolute right-6 top-0 h-[92px] w-[71px] -translate-y-[78%] sm:h-[112px] sm:w-[86px]"
        />
        <p className="font-display text-[1.3rem] font-semibold">Projects are being added</p>
        <p className="mt-2 max-w-[52ch] text-muted">
          In the meantime, the resume covers recent work, or you can{" "}
          <a href={`mailto:${site.email}`} className="text-blue underline-offset-4 hover:underline">
            email me
          </a>{" "}
          for a walkthrough.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            disabled={counts[f.id] === 0}
            onClick={() => setFilter(f.id)}
            className="pressable rounded-lg border border-line px-3.5 py-2 text-[0.92rem] text-muted hover:text-text disabled:pointer-events-none disabled:opacity-40 aria-pressed:border-line-strong aria-pressed:bg-raise-2 aria-pressed:text-text"
          >
            {f.label} <span className="text-faint">{counts[f.id]}</span>
          </button>
        ))}
      </div>

      <motion.ul layout={!reduce} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((project, i) => {
            const large = i === 0 && project.featured;
            return (
              <motion.li
                key={project.url + project.title}
                layout={!reduce}
                // Layout animations own `transform` here, so the entrance uses the scale shorthand.
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: [0.77, 0, 0.175, 1] }}
                className={`relative ${large ? "sm:col-span-2 lg:col-span-3" : ""}`}
              >
                {i === 0 ? (
                  <CompanionAnchor
                    id="projects"
                    pose="sit"
                    look="down"
                    tone={project.category === "data" ? "data" : "software"}
                    say="Click a card to open the live project."
                    className="absolute right-6 top-0 z-20 h-[92px] w-[71px] -translate-y-[78%] sm:h-[112px] sm:w-[86px]"
                  />
                ) : null}
                <ProjectCard project={project} large={large} />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
