"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { skillPaths, type Path } from "@/config/site";
import { CompanionAnchor, CompanionSection, useCompanion } from "@/components/companion/context";
import { PATH_EVENT } from "@/components/path-events";
import { SectionHeading } from "./section-heading";

const order: Path[] = ["software", "data"];
const accent = { software: "text-blue", data: "text-green" } as const;

export function Skills() {
  const [path, setPath] = useState<Path>("software");
  const { setTone } = useCompanion();
  const reduce = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const onSelect = (e: Event) => setPath((e as CustomEvent<Path>).detail);
    window.addEventListener(PATH_EVENT, onSelect);
    return () => window.removeEventListener(PATH_EVENT, onSelect);
  }, []);

  useEffect(() => setTone("skills", path), [path, setTone]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next = path === "software" ? "data" : "software";
    setPath(next);
    tabs.current[order.indexOf(next)]?.focus();
  };

  const current = skillPaths[path];

  return (
    <CompanionSection id="skills" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading
        title="Skills"
        lead="Two sides of the same engineer. Each skill lists where I've actually used it."
      />

      <div className="mt-10 flex flex-wrap items-end gap-x-4 gap-y-4">
        {/* Segmented switch. The active look is one copy revealed with clip-path, so text and fill change together. */}
        <div
          role="tablist"
          aria-label="Skill path"
          onKeyDown={onKeyDown}
          className="relative grid grid-cols-2 rounded-xl border border-line-strong bg-raise p-1"
        >
          {order.map((p, i) => (
            <button
              key={p}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`tab-${p}`}
              aria-selected={path === p}
              aria-controls="skills-panel"
              tabIndex={path === p ? 0 : -1}
              onClick={() => setPath(p)}
              className="pressable relative z-0 rounded-[9px] whitespace-nowrap px-4 py-2.5 text-[0.95rem] font-medium text-muted hover:text-text sm:px-6"
            >
              <Label path={p} />
            </button>
          ))}
          <div
            aria-hidden
            className="path-switch-active pointer-events-none absolute inset-1 z-10 grid grid-cols-2"
            style={{
              clipPath: path === "software" ? "inset(0 50% 0 0 round 9px)" : "inset(0 0 0 50% round 9px)",
            }}
          >
            {order.map((p) => (
              <span
                key={p}
                className={`grid place-items-center whitespace-nowrap rounded-[9px] px-4 py-2.5 text-[0.95rem] font-medium sm:px-6 ${
                  p === "software" ? "bg-blue text-blue-ink" : "bg-green text-green-ink"
                }`}
              >
                <Label path={p} />
              </span>
            ))}
          </div>
        </div>

        <CompanionAnchor
          id="skills"
          pose="point-left"
          look="left"
          tone="software"
          say="Flip this switch to see the other side."
          className="h-[80px] w-[72px] sm:h-[96px] sm:w-[86px]"
        />
      </div>

      <div id="skills-panel" role="tabpanel" aria-labelledby={`tab-${path}`} className="mt-10 min-h-[22rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={path}
            initial={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(2px)", transform: "translateY(6px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(2px)", transform: "translateY(-4px)" }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="max-w-[60ch] text-[1.15rem]">{current.summary}</p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {current.groups.map((group) => (
                <div key={group.title} className="rounded-2xl border border-line bg-raise p-6">
                  <h3 className={`font-display text-[1.15rem] font-semibold ${accent[path]}`}>{group.title}</h3>
                  <ul className="mt-4 divide-y divide-line">
                    {group.skills.map((skill) => (
                      <li key={skill.name} className="py-3 first:pt-0 last:pb-0">
                        <p className="font-medium leading-snug">{skill.name}</p>
                        <p className="mt-0.5 text-[0.92rem] text-muted">{skill.usedIn}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </CompanionSection>
  );
}

function Label({ path }: { path: Path }) {
  return (
    <>
      <span className="sm:hidden">{skillPaths[path].short}</span>
      <span className="hidden sm:inline">{skillPaths[path].label}</span>
    </>
  );
}
