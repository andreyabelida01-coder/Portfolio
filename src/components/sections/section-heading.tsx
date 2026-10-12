import type { ReactNode } from "react";

export function SectionHeading({ title, lead, aside }: { title: string; lead: string; aside?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <h2 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-none tracking-[-0.015em]">{title}</h2>
        <p className="mt-4 max-w-[58ch] text-muted">{lead}</p>
      </div>
      {aside}
    </div>
  );
}
