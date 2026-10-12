export type Category = "fullstack" | "data";

export type Project = {
  title: string;
  url: string;
  description?: string;
  /** A path in /public (e.g. "/projects/aquacast.png") or a full image URL. */
  image?: string;
  /** Shown under the card. Defaults to the link's domain. */
  siteName?: string;
  category: Category;
  tags: string[];
  featured?: boolean;
};

export const categoryLabel: Record<Category, string> = {
  fullstack: "Full-stack",
  data: "Data analytics",
};
