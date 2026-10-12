import type { Look, Pose } from "./context";

/**
 * Bit: a young engineer in a hoodie with a little chip on the chest. Original character for this site.
 * The hoodie takes --bit-accent from a parent, so it turns blue on the software path and green on the data path.
 * Soft gradients give it a light 3D feel while staying a flat, crisp SVG at any size.
 */

const SKIN = "#f4c7a1";
const SKIN_SHADE = "#e2a57b";
const HAIR = "#1c2230";
const PANTS = "#2c3648";

// Arm rotation around the shoulder, in degrees. 0 = hanging at the side.
const ARMS: Record<Pose, { left: number; right: number }> = {
  wave: { left: 6, right: -140 },
  "point-left": { left: 79, right: 4 },
  "point-right": { left: -4, right: -79 },
  sit: { left: 22, right: -22 },
  rest: { left: -10, right: 10 },
};

const LOOK: Record<Look, string> = {
  left: "translate(-2px, 0px)",
  right: "translate(2px, 0px)",
  down: "translate(0px, 1.6px)",
  center: "translate(0px, 0px)",
};

const ease = "cubic-bezier(0.77, 0, 0.175, 1)";

function Arm({ side, angle, waving }: { side: "left" | "right"; angle: number; waving?: boolean }) {
  const sx = side === "left" ? 31 : 69;
  const hx = side === "left" ? 27 : 73;
  return (
    <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${sx}px 66px`, transformBox: "view-box", transition: `transform 320ms ${ease}` }}>
      <g className={waving ? "bit-wave" : undefined} style={{ transformOrigin: `${sx}px 66px`, transformBox: "view-box" }}>
        {/* outline, sleeve, shading */}
        <path d={`M${sx} 66 L${hx} 85`} stroke="rgb(13 36 48 / 0.28)" strokeWidth="10.5" strokeLinecap="round" />
        <path d={`M${sx} 66 L${hx} 85`} stroke="var(--bit-accent)" strokeWidth="8.4" strokeLinecap="round" />
        <path d={`M${sx} 66 L${hx} 85`} stroke="rgb(0 0 0 / 0.12)" strokeWidth="8.4" strokeLinecap="round" />
        {/* cuff and hand */}
        <path d={`M${hx - 3.4} ${84.5} h6.8`} stroke="rgb(255 255 255 / 0.55)" strokeWidth="2" strokeLinecap="round" />
        <circle cx={hx} cy="89.5" r="4" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="0.8" />
      </g>
    </g>
  );
}

export function BitMascot({ pose, look = "center" }: { pose: Pose; look?: Look }) {
  const arms = ARMS[pose];
  const happy = pose === "rest";
  const grinning = pose === "wave";
  const sitting = pose === "sit";

  return (
    <svg viewBox="0 0 100 130" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="bit-skin" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#ffe0c6" />
          <stop offset="60%" stopColor={SKIN} />
          <stop offset="100%" stopColor={SKIN_SHADE} />
        </radialGradient>
        <linearGradient id="bit-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#323b4f" />
          <stop offset="100%" stopColor={HAIR} />
        </linearGradient>
        <linearGradient id="bit-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Legs and sneakers. When sitting they swing over the edge Bit is perched on. */}
      {(["l", "r"] as const).map((s) => {
        const x = s === "l" ? 42 : 58;
        return (
          <g
            key={s}
            className={sitting ? (s === "l" ? "bit-swing-l" : "bit-swing-r") : undefined}
            style={{ transformOrigin: `${x}px 98px`, transformBox: "view-box" }}
          >
            <path d={`M${x} 98 V114`} stroke={PANTS} strokeWidth="9.5" strokeLinecap="round" />
            <rect x={x - (s === "l" ? 8 : 5)} y="113" width="13" height="7.5" rx="3.6" fill="#fff" stroke="#c3d0d9" strokeWidth="1" />
            <path d={`M${x - (s === "l" ? 6 : 3)} 118 h9`} stroke="var(--bit-accent)" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        );
      })}

      {/* Hoodie body */}
      <path
        d="M29 66c0-6 8-9 21-9s21 3 21 9l2 30c0 3-2 5-5 5H32c-3 0-5-2-5-5z"
        fill="var(--bit-accent)"
        stroke="rgb(13 36 48 / 0.28)"
        strokeWidth="1.2"
      />
      <path d="M29 66c0-6 8-9 21-9s21 3 21 9l2 30c0 3-2 5-5 5H32c-3 0-5-2-5-5z" fill="url(#bit-shade)" />
      {/* Hood folded at the neck */}
      <path d="M37 59c3 6 23 6 26 0c-2 5-24 5-26 0z" fill="rgb(0 0 0 / 0.18)" />
      <path d="M38 58.5c4 3.5 20 3.5 24 0" stroke="rgb(255 255 255 / 0.35)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Drawstrings */}
      <g stroke="#fff" strokeWidth="1.3" strokeLinecap="round" opacity="0.9">
        <path d="M46 63l-0.8 9" />
        <path d="M54 63l0.8 9" />
      </g>
      <circle cx="45.1" cy="73" r="1.2" fill="#fff" />
      <circle cx="54.9" cy="73" r="1.2" fill="#fff" />
      {/* Chip logo */}
      <g>
        <rect x="45" y="77" width="10" height="9" rx="2" fill="#fff" opacity="0.95" />
        <rect x="47.5" y="79.3" width="5" height="4.4" rx="1" fill="var(--bit-accent)" />
        <g stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity="0.95">
          <path d="M43.4 79.5h1.6M43.4 83.5h1.6M55 79.5h1.6M55 83.5h1.6" />
        </g>
      </g>
      {/* Pocket */}
      <path d="M38 90h24l-3 7H41z" fill="rgb(0 0 0 / 0.12)" />

      {/* Neck */}
      <rect x="45.5" y="53" width="9" height="6" rx="2" fill={SKIN_SHADE} />

      {/* Ears */}
      <circle cx="29.5" cy="38.5" r="4.6" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="1" />
      <circle cx="70.5" cy="38.5" r="4.6" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="1" />

      {/* Head */}
      <ellipse cx="50" cy="37" rx="21" ry="20.5" fill="url(#bit-skin)" stroke={SKIN_SHADE} strokeWidth="1" />

      {/* Hair: short sides, swept fringe and a small tuft */}
      <path
        d="M28.6 37c-1.4-15 9-24.5 21.6-24.5c13 0 22.4 8.6 21.2 23.6c-2.4-6-6.6-9.4-11.6-10.6c-5 4.6-14.6 6.2-23 4.4c-3.4 1.8-6.4 4-8.2 7.1z"
        fill="url(#bit-hair)"
      />
      <path d="M46 13.6c2.4-5.4 8.6-6.8 12-4.4c-3.4 0-6.6 1.8-8.6 5z" fill={HAIR} />
      <path d="M36 21c4-4 10-5.6 15-5" stroke="rgb(255 255 255 / 0.18)" strokeWidth="1.6" strokeLinecap="round" fill="none" />

      {/* Face */}
      <g style={{ transform: LOOK[look], transition: `transform 300ms cubic-bezier(0.23, 1, 0.32, 1)` }}>
        {/* Brows */}
        <g stroke={HAIR} strokeWidth="2.6" strokeLinecap="round">
          <path d="M37.5 32.6l7-1.2" />
          <path d="M55.5 31.4l7 1.2" />
        </g>
        {happy ? (
          <g stroke={HAIR} strokeWidth="2.2" strokeLinecap="round" fill="none">
            <path d="M38.6 40.4q3-3.4 6 0" />
            <path d="M55.4 40.4q3-3.4 6 0" />
          </g>
        ) : (
          <g className="bit-eyes">
            <ellipse cx="41.6" cy="39.6" rx="2.7" ry="3.4" fill={HAIR} />
            <ellipse cx="58.4" cy="39.6" rx="2.7" ry="3.4" fill={HAIR} />
            <circle cx="42.5" cy="38.4" r="0.95" fill="#fff" />
            <circle cx="59.3" cy="38.4" r="0.95" fill="#fff" />
          </g>
        )}
        {/* Nose */}
        <path d="M50.4 41.6q1.4 2.4-0.9 3" stroke={SKIN_SHADE} strokeWidth="1.3" strokeLinecap="round" fill="none" />
        {/* Mouth */}
        {grinning ? (
          <path d="M44.6 47.2q5.4 6.2 10.8 0z" fill="#7b2f24" stroke="#7b2f24" strokeWidth="1" strokeLinejoin="round" />
        ) : (
          <path d="M45.4 47.6q4.6 3.4 9.2 0" stroke="#7b2f24" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        )}
        {/* Cheeks */}
        <circle cx="36.5" cy="45" r="2.6" fill="#f08f7a" opacity="0.22" />
        <circle cx="63.5" cy="45" r="2.6" fill="#f08f7a" opacity="0.22" />
      </g>

      {/* Arms go last so a raised hand stays in front of the head */}
      <Arm side="left" angle={arms.left} />
      <Arm side="right" angle={arms.right} waving={pose === "wave"} />
    </svg>
  );
}
