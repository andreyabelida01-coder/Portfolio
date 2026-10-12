import { Suspense } from "react";
import { CompanionProvider } from "@/components/companion/context";
import { Companion } from "@/components/companion/companion";
import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <CompanionProvider>
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Skills />
        <Suspense fallback={<div className="mx-auto h-[40rem] max-w-6xl" />}>
          <Projects />
        </Suspense>
        <Contact />
      </main>
      <Footer />
      <Companion />
    </CompanionProvider>
  );
}
