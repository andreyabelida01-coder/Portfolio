import { certifications, experience } from "@/config/site";
import { CompanionAnchor, CompanionSection } from "@/components/companion/context";
import { SectionHeading } from "./section-heading";

const dot = { software: "bg-blue", data: "bg-green" } as const;

export function Experience() {
  return (
    <CompanionSection id="experience" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading
        title="Experience"
        lead="Internship, lab and student leadership work, latest first."
        aside={
          <CompanionAnchor
            id="experience"
            pose="point-left"
            look="left"
            tone="data"
            say="Most recent first. The realme internship is where the data work happened."
            className="h-[92px] w-[71px] shrink-0 sm:h-[112px] sm:w-[86px]"
          />
        }
      />

      <ol className="mt-12 border-l border-line">
        {experience.map((item) => (
          <li key={item.org + item.role} className="relative pb-12 pl-7 last:pb-0 sm:pl-10">
            <span
              className={`absolute -left-[5px] top-2 size-[9px] rounded-full ring-4 ring-bg ${item.path ? dot[item.path] : "bg-muted"}`}
              aria-hidden
            />
            <div className="grid gap-x-10 gap-y-2 md:grid-cols-[11rem_1fr]">
              <p className="text-[0.95rem] text-muted md:pt-0.5">
                {item.start} – {item.end}
              </p>
              <div>
                <h3 className="font-display text-[1.35rem] font-semibold leading-tight">{item.role}</h3>
                <p className="mt-1 text-muted">
                  {item.org}, {item.place}
                </p>
                <ul className="mt-4 max-w-[68ch] space-y-2.5">
                  {item.points.map((point) => (
                    <li key={point} className="relative pl-5 text-[1rem] leading-relaxed">
                      <span className="absolute left-0 top-[0.7em] h-px w-2.5 bg-line-strong" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-20">
        <h3 className="font-display text-[1.5rem] font-semibold">Certifications</h3>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {certifications.map((cert) => (
            <li key={cert.name} className="flex items-start gap-3.5 bg-raise p-5">
              <span className={`mt-2 size-2 shrink-0 rounded-full ${dot[cert.path]}`} aria-hidden />
              <div>
                <p className="font-medium leading-snug">{cert.name}</p>
                <p className="mt-1 text-[0.95rem] text-muted">
                  {cert.issuer}, {cert.year}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </CompanionSection>
  );
}
