export type TierId = "guest" | "member" | "sponsor";
export type Billing = "monthly" | "yearly";

export type Tier = {
  id: TierId;
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  accent: string;
  accentSoft: string;
  accentBorder: string;
  perks: string[];
  badge?: string;
  limits?: string;
};

export const TIERS: Record<TierId, Tier> = {
  guest: {
    id: "guest",
    name: "Guest",
    tagline: "Look around. No commitment.",
    monthly: 0,
    yearly: 0,
    accent: "#03CCD9",
    accentSoft: "rgba(3,204,217,0.10)",
    accentBorder: "rgba(3,204,217,0.32)",
    perks: [
      "Browse public Kidunas",
      "Watch the feed read-only",
      "No avatar, no posting, no Exchange",
      "No ownership in any movement",
    ],
    limits: "You can’t join Kidunas, mint avatars, or trade on the Exchange.",
  },
  member: {
    id: "member",
    name: "Member",
    tagline: "Join the Kidunas you care about.",
    monthly: 10,
    yearly: 100,
    accent: "#EB8000",
    accentSoft: "rgba(235,128,0,0.12)",
    accentBorder: "rgba(235,128,0,0.42)",
    perks: [
      "Join unlimited Kidunas",
      "Mint and design your avatars",
      "Full access to Kiduna Exchange",
      "Voice + vote inside every Kiduna you join",
    ],
    badge: "Most popular",
  },
  sponsor: {
    id: "sponsor",
    name: "Sponsor",
    tagline: "Launch the Kidunas others join.",
    monthly: 100,
    yearly: 1000,
    accent: "#EC008C",
    accentSoft: "rgba(236,0,140,0.10)",
    accentBorder: "rgba(236,0,140,0.36)",
    perks: [
      "Everything in Member",
      "Launch unlimited Kidunas",
      "Design Kidunas + their economies in Studio",
      "Connect Kidunas across the Exchange",
    ],
  },
};

export const TIER_ORDER: TierId[] = ["guest", "member", "sponsor"];

export function isTierId(v: string | null | undefined): v is TierId {
  return v === "guest" || v === "member" || v === "sponsor";
}
