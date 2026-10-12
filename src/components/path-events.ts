"use client";
import type { Path } from "@/config/site";

/** Lets the hero's trace labels open the matching side of the skills switch. */
export const PATH_EVENT = "portfolio:select-path";

export function selectPath(path: Path) {
  window.dispatchEvent(new CustomEvent<Path>(PATH_EVENT, { detail: path }));
}
