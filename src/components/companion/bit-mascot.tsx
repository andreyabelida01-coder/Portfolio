import type { Look, Pose } from "./context";

/**
 * Bit: a small microchip with an LED face. Original character drawn for this site.
 * Colors come from --bit-accent on a parent, so Bit can switch between the blue and green paths.
 */

// Rotation of each arm around its shoulder, in degrees. 0 = hanging down.
const ARMS: Record<Pose, { left: number; right: number }> = {
  wave: { left: 8, right: -160 },
  "point-left": { left: 72, right: 6 },
  "point-right": { left: -6, right: -72 },
  sit: { left: 28, right: -28 },
  rest: { left: 4, right: -4 },
};

const LOOK: Record<Look, string> = {
  left: "translate(-3px, 0px)",
  right: "translate(3px, 0px)",
  down: "translate(0px, 3px)",
  center: "translate(0px, 0px)",
};

const armTransition = "transform 300ms cubic-bezier(0.77, 0, 0.175, 1)";

export function BitMascot({ pose, look = "center" }: { pose: Pose; look?: Look }) {
  const arms = ARMS[pose];
  const happy = pose === "rest";
  const sitting = pose === "sit";

  return (
    <svg viewBox="0 0 100 112" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <filter id="bit-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      {/* Legs. When sitting they swing over the edge Bit is perched on. */}
      <g stroke="var(--muted)" strokeWidth="5" strokeLinecap="round">
        <g className={sitting ? "bit-swing-l" : undefined} style={{ transformOrigin: "40px 78px", transformBox: "view-box" }}>
          <path d="M40 78v15" />
          <rect x="33" y="93" width="12" height="5" rx="2.5" fill="var(--muted)" stroke="none" />
        </g>
        <g className={sitting ? "bit-swing-r" : undefined} style={{ transformOrigin: "60px 78px", transformBox: "view-box" }}>
          <path d="M60 78v15" />
          <rect x="55" y="93" width="12" height="5" rx="2.5" fill="var(--muted)" stroke="none" />
        </g>
      </g>

      {/* Arms */}
      <g stroke="var(--muted)" strokeWidth="5" strokeLinecap="round" fill="var(--muted)">
        <g style={{ transform: `rotate(${arms.left}deg)`, transformOrigin: "19px 44px", transformBox: "view-box", transition: armTransition }}>
          <path d="M19 44l-5 16" />
          <circle cx="13.5" cy="62" r="3.6" stroke="none" />
        </g>
        <g style={{ transform: `rotate(${arms.right}deg)`, transformOrigin: "81px 44px", transformBox: "view-box", transition: armTransition }}>
          <g className={pose === "wave" ? "bit-wave" : undefined} style={{ transformOrigin: "81px 44px", transformBox: "view-box" }}>
            <path d="M81 44l5 16" />
            <circle cx="86.5" cy="62" r="3.6" stroke="none" />
          </g>
        </g>
      </g>

      {/* Antenna with a status LED */}
      <path d="M50 24V11" stroke="var(--line-strong)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="8" r="6" fill="var(--bit-accent)" opacity="0.55" filter="url(#bit-glow)" />
      <circle cx="50" cy="8" r="4" fill="var(--bit-accent)" />

      {/* Pins, like a DIP chip */}
      <g fill="var(--line-strong)">
        <rect x="14" y="31" width="6" height="4" rx="1.2" />
        <rect x="14" y="51" width="6" height="4" rx="1.2" />
        <rect x="14" y="61" width="6" height="4" rx="1.2" />
        <rect x="80" y="31" width="6" height="4" rx="1.2" />
        <rect x="80" y="51" width="6" height="4" rx="1.2" />
        <rect x="80" y="61" width="6" height="4" rx="1.2" />
      </g>

      {/* Body */}
      <rect x="19" y="22" width="62" height="58" rx="14" fill="var(--raise-2)" stroke="var(--bit-accent)" strokeWidth="2.2" />
      <circle cx="28" cy="31" r="1.8" fill="var(--line-strong)" />

      {/* Face screen */}
      <rect x="28" y="33" width="44" height="29" rx="8" fill="#03101a" />
      <g style={{ transform: LOOK[look], transition: "transform 300ms cubic-bezier(0.23, 1, 0.32, 1)" }}>
        {happy ? (
          <g stroke="var(--bit-accent)" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M36.5 47.5q3.5-5 7 0" />
            <path d="M56.5 47.5q3.5-5 7 0" />
          </g>
        ) : (
          <g className="bit-eyes" fill="var(--bit-accent)">
            <rect x="37" y="39" width="7" height="11" rx="3.5" />
            <rect x="56" y="39" width="7" height="11" rx="3.5" />
          </g>
        )}
        <path d="M45 55.5q5 3.6 10 0" stroke="var(--bit-accent)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </g>

      {/* Status bar */}
      <rect x="40" y="68" width="20" height="3.5" rx="1.75" fill="var(--bit-accent)" opacity="0.5" />
    </svg>
  );
}
