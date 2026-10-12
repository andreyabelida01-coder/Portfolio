# Andrey Abelida · Portfolio

A light, circuit-board themed portfolio built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4** and **Motion (Framer Motion)**. It's a plain website: no database, no accounts, no login. Anyone with the link sees the portfolio straight away.

What's on the page:

- **Hero** with your photo in a chip-style frame, your name, a rotating role line, and a signal trace that splits into the two paths: software & full-stack (blue) and data analytics & hardware (green). Clicking a path opens that side of the Skills section.
- **Bit, the floating companion.** A young engineer in a hoodie that follows you down the page. When you reach a new section it breaks into particles, streams across the screen and reassembles in its spot there.
- **Experience** timeline and certifications.
- **Skills** with a two-path switch. Every skill says where it was actually used.
- **Projects** with filters.
- **Contact** with email, copy-email, phone and resume download.

## Run it on your computer

You need Node.js 20.9 or newer.

```
npm install
npm run dev
```

Then open http://localhost:3000.

## Edit your content

Everything personal is in **`src/config/site.ts`**:

- **Your photo:** save it as `public/profile.jpg` (a portrait crop, roughly 4:5, works best). Until it exists, the frame shows your initials.
- `roles`: the lines that rotate under your name.
- `links.github` and `links.linkedin`: paste your profile links. Their buttons appear once they have a value.
- `experience`, `certifications`, `skillPaths`: the text on the page.
- `projects`: your project cards (see below).
- `url`: your live address after deploying, used when the link is shared on Messenger, LinkedIn and similar.

### Add a project

Copy a block in the `projects` list and fill it in:

```ts
{
  title: "Sales Validation Dashboard",
  url: "https://github.com/your-username/sales-dashboard",
  description: "One sentence on what it does and who it helps.",
  category: "data",            // "fullstack" (blue) or "data" (green)
  tags: ["React", "Node.js", "Google Sheets"],
  image: "/projects/sales-dashboard.png",   // optional
},
```

For a picture, save a screenshot (about 1200 × 630 pixels works best) into the `public/projects` folder and put its name in `image`. Without one, the card shows a clean tile with the project's first letter. Mark one project `featured: true` to show it wide at the top.

### Replace the resume

Put the new PDF in `public` with the same name, `Andrey-Abelida-Resume.pdf`, replacing the old one.

## Put it online with Vercel (free)

1. Push the folder to a GitHub repository:
   ```
   git init
   git add -A
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
   git push -u origin main
   ```
2. On [vercel.com](https://vercel.com), choose **Add New → Project**, import the repository and click **Deploy**. There's nothing to configure.
3. Copy your Vercel address into `url` in `src/config/site.ts`, then push again. From then on, every `git push` updates the site.

## How Bit works

- `src/components/companion/context.tsx` works out which section crosses a reading line 45% down the screen, and keeps a list of **anchors**: empty boxes in the layout where Bit stands. Each `CompanionAnchor` sets Bit's pose (`wave`, `point-left`, `point-right`, `sit`, `rest`), where it looks, its color and what it says.
- `src/components/companion/companion.tsx` draws Bit in a layer above the page and keeps it on its anchor while you scroll. If the anchor scrolls off screen, Bit waits at the right edge.
- On a section change, Bit fades out, 18 particles scatter and travel along curved paths to the next anchor, and Bit reassembles there. Only `transform` and `opacity` are animated, so it stays smooth on phones.
- With **reduce motion** turned on in the device settings, Bit just fades between spots. On phones its speech bubble opens on tap, so it never covers what you're reading.
- Bit (`bit-mascot.tsx`) is an original SVG character with soft shading. His hoodie turns blue on the software path and green on the data path.

The motion follows Emil Kowalski's animation guidelines: strong ease-out curves, interface animations under 300 ms, no `scale(0)`, hover effects only on devices with a mouse, and press feedback at `scale(0.97)`.

## Project structure

```
src/config/site.ts            All your content, including projects
src/app/page.tsx              The page
src/app/globals.css           Colors and animation styles
src/components/sections/      Hero, Experience, Skills, Projects, Contact
src/components/companion/     Bit and the section tracking
public/                       Resume PDF and project images
```

`npm run build` checks everything and builds the site; `npm run lint` checks code style.
