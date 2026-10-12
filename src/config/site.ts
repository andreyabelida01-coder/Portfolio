/**
 * Everything personal on the site lives in this file.
 * Edit the values here; no component needs to change.
 */

import type { Project } from "@/lib/types";

export type Path = "software" | "data";

export const site = {
  name: "Andrey Ralph Abelida",
  shortName: "Andrey Abelida",
  initials: "AA",
  role: "Computer Engineering · Full-Stack · Data Analytics",
  location: "Manila, Philippines",
  intro:
    "I'm a 4th-year Computer Engineering student at the Polytechnic University of the Philippines, specializing in Big Data Analytics. I build full-stack web apps and turn messy business data into something a team can act on.",
  availability: "Open to data analytics and software internships",
  email: "andreyabelida01@gmail.com",
  phone: "09940654468",
  // Leave a link empty ("") to hide its button.
  links: {
    github: "https://github.com/andreyabelida01-coder",
    linkedin: "https://www.linkedin.com/in/andrey-abelida-018246395/",
  },
  // Your live address, used for link previews when the site is shared. Change it after deploying.
  url: "https://andrey-abelida.vercel.app",
  resume: "/Andrey-Abelida-Resume.pdf",
};

export type ExperienceItem = {
  org: string;
  role: string;
  place: string;
  start: string;
  end: string;
  path?: Path;
  points: string[];
};

export const experience: ExperienceItem[] = [
  {
    org: "Global Technological Trading Inc. (realme Philippines)",
    role: "Data Validation Intern",
    place: "BGC, Taguig",
    start: "May 2026",
    end: "Aug 2026",
    path: "data",
    points: [
      "Validated and cross-checked company sales data in Excel and Google Sheets for accuracy, completeness and consistency, using pivot tables and XLOOKUP.",
      "Designed and built a web dashboard in Node.js and React that gave the team one central view of their data.",
      "Used the team's existing Google Sheets as the data source and deployed on Render's free tier, so the dashboard runs at zero hosting cost.",
    ],
  },
  {
    org: "Computer Engineering Laboratory Office, PUP",
    role: "Student Assistant",
    place: "Sta. Mesa, Manila",
    start: "2025",
    end: "Aug 2026",
    path: "data",
    points: [
      "Maintained laboratory equipment, facilities and office resources.",
      "Gave technical and administrative support to faculty, staff and students during academic and department activities.",
    ],
  },
  {
    org: "PUP Association of Concerned Computer Engineering Students for Service",
    role: "Vice President for Academic Affairs",
    place: "Sta. Mesa, Manila",
    start: "2025",
    end: "2026",
    points: [
      "Planned and ran academic programs for students; led the Freshmen Orientation and two Hard Hatting Ceremonies, and spoke in the Seminar Series.",
      "Earlier roles: Control Officer (2024–2025) and 1st Year Governor (2023–2024).",
    ],
  },
];

export type Certification = { name: string; issuer: string; year: string; path: Path };

export const certifications: Certification[] = [
  { name: "Big Data Fundamentals with PySpark", issuer: "DataCamp", year: "2026", path: "data" },
  { name: "Introduction to Data Visualization with Matplotlib", issuer: "DataCamp", year: "2026", path: "data" },
  { name: "Introduction to Networks", issuer: "Cisco Networking Academy", year: "2025", path: "data" },
  { name: "Certified Fundamentals in Cybersecurity", issuer: "Fortinet", year: "2024–2026", path: "data" },
];

export type SkillGroup = { title: string; skills: { name: string; usedIn: string }[] };

export const skillPaths: Record<
  Path,
  { label: string; short: string; summary: string; groups: SkillGroup[] }
> = {
  software: {
    label: "Software & full-stack",
    short: "Software",
    summary: "Web apps from database to interface, shipped on free and low-cost infrastructure.",
    groups: [
      {
        title: "Frontend",
        skills: [
          { name: "React", usedIn: "realme sales dashboard" },
          { name: "TypeScript", usedIn: "This portfolio" },
          { name: "Next.js", usedIn: "This portfolio" },
          { name: "Tailwind CSS", usedIn: "This portfolio" },
        ],
      },
      {
        title: "Backend & APIs",
        skills: [
          { name: "Node.js", usedIn: "realme dashboard, AquaCast" },
          { name: "REST APIs", usedIn: "AquaCast backend" },
          { name: "Supabase", usedIn: "AquaCast" },
          { name: "Java, C++", usedIn: "Coursework" },
        ],
      },
      {
        title: "Shipping",
        skills: [
          { name: "Vercel & Render", usedIn: "AquaCast, realme dashboard" },
          { name: "Git & GitHub", usedIn: "All projects" },
          { name: "Testing & debugging", usedIn: "CpE laboratory work" },
        ],
      },
    ],
  },
  data: {
    label: "Data & hardware",
    short: "Data & hardware",
    summary: "Cleaning, validating and visualizing data, backed by a computer engineering foundation.",
    groups: [
      {
        title: "Spreadsheets & BI",
        skills: [
          { name: "Excel & Google Sheets", usedIn: "realme sales validation" },
          { name: "Pivot tables, XLOOKUP", usedIn: "realme sales validation" },
          { name: "Power BI", usedIn: "Foundational" },
          { name: "Looker Studio", usedIn: "Foundational" },
        ],
      },
      {
        title: "Code & query",
        skills: [
          { name: "Python", usedIn: "Coursework, DataCamp" },
          { name: "SQL (Supabase, BigQuery)", usedIn: "AquaCast, coursework" },
          { name: "PySpark", usedIn: "DataCamp certification" },
          { name: "Matplotlib", usedIn: "DataCamp certification" },
        ],
      },
      {
        title: "Systems",
        skills: [
          { name: "Computer hardware & OS", usedIn: "CpE coursework, lab office" },
          { name: "Networking", usedIn: "Cisco ITN, Packet Tracer" },
          { name: "Cybersecurity basics", usedIn: "Fortinet certification" },
        ],
      },
    ],
  },
};

/**
 * Projects shown on the site, in this order. To add one, copy a block and fill it in.
 * - category: "fullstack" (blue) or "data" (green)
 * - image: optional. Put a screenshot in /public/projects/ and write "/projects/file.png",
 *   or leave it out to show a clean placeholder tile.
 * - featured: the first featured project is shown wide at the top.
 */
export const projects: Project[] = [
  {
    title: "AquaCast",
    url: "https://aquacast-research.vercel.app",
    description:
      "Edge-based dissolved oxygen monitoring and forecasting for fish ponds. It flags rising low-oxygen risk early and explains why, so the pond operator can decide what to do.",
    category: "fullstack",
    tags: ["Node.js", "Supabase", "Forecasting", "IoT"],
    featured: true,
  },
];
