import { projects } from "@/config/site";
import { CompanionSection } from "@/components/companion/context";
import { ProjectGrid } from "./project-grid";
import { SectionHeading } from "./section-heading";

export function Projects() {
  // Featured projects first, otherwise the order from site.ts.
  const ordered = [...projects].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  return (
    <CompanionSection id="projects" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading title="Projects" lead="Things I've built and shipped. Each card links to the live project." />
      <ProjectGrid projects={ordered} />
    </CompanionSection>
  );
}
