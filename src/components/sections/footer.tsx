import { cacheLife } from "next/cache";
import { site } from "@/config/site";

export async function Footer() {
  "use cache";
  cacheLife("days");
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-[0.92rem] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>Built with Next.js and Framer Motion. Bit is the little chip.</p>
      </div>
    </footer>
  );
}
