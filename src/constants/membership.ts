/**
 * Membership Tier Definitions
 *
 * Single source of truth for pricing, features, and limits.
 * Used by PricingCard, FeatureList, and ComparisonTable.
 */

// ─── Types ────────────────────────────────────────────────

export type TierId = "guest" | "creator" | "sponsor";
export type BillingPeriod = "monthly" | "yearly";

export interface TierPricing {
  monthly: number;
  yearly: number;
}

export interface FeatureEntry {
  label: string;
  guest: string | boolean;
  creator: string | boolean;
  sponsor: string | boolean;
}

export interface FeatureGroup {
  category: string;
  features: FeatureEntry[];
}

export interface TierDefinition {
  id: TierId;
  name: string;
  tagline: string;
  pricing: TierPricing;
  highlighted: boolean;
  badge?: string;
  ctaLabel: string;
  ctaVariant: "secondary" | "primary";
  shortFeatures: string[];
}

// ─── Tier Definitions ─────────────────────────────────────

export const TIERS: TierDefinition[] = [
  {
    id: "guest",
    name: "Guest",
    tagline: "Explore the network",
    pricing: { monthly: 0, yearly: 0 },
    highlighted: false,
    ctaLabel: "Continue as Guest",
    ctaVariant: "secondary",
    shortFeatures: [
      "Chat with agents (5/day)",
      "Play published games",
      "View leaderboards",
      "Redeem invitation codes",
      "Browse offerings",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    tagline: "Build your presence",
    pricing: { monthly: 10, yearly: 100 },
    highlighted: true,
    badge: "Recommended",
    ctaLabel: "Choose Creator",
    ctaVariant: "primary",
    shortFeatures: [
      "Everything in Guest",
      "Create Presence agents (up to 3)",
      "Create Worker agents (up to 5)",
      "Knowledge bases & Prompts",
      "Create experiences (up to 2)",
      "Full game content tools",
      "Dashboard & Analytics",
      "Create invitation codes (up to 10)",
      "Vote on proposals",
    ],
  },
  {
    id: "sponsor",
    name: "Sponsor",
    tagline: "Lead the movement",
    pricing: { monthly: 100, yearly: 1000 },
    highlighted: false,
    ctaLabel: "Choose Sponsor",
    ctaVariant: "primary",
    shortFeatures: [
      "Everything in Creator",
      "Unlimited agents",
      "MCP Tool connections",
      "Orchestration config",
      "Create contexts & gatherings",
      "Governance (Vibes, Offerings, Coins)",
      "AI Game Editor (full)",
      "Builder (drag-and-drop)",
      "Advanced analytics & Real-time",
      "Story Arcs, Cycles, World Map",
      "Create proposals",
      "Unlimited invitation codes",
    ],
  },
];

// ─── Full Comparison Features ─────────────────────────────

export const COMPARISON: FeatureGroup[] = [
  {
    category: "Agents",
    features: [
      { label: "Chat with agents", guest: "5/day", creator: "Unlimited", sponsor: "Unlimited" },
      { label: "Voice chat", guest: false, creator: true, sponsor: true },
      { label: "Create Presence agents", guest: false, creator: "Up to 3", sponsor: "Unlimited" },
      { label: "Create Worker agents", guest: false, creator: "Up to 5", sponsor: "Unlimited" },
    ],
  },
  {
    category: "Clarity Process",
    features: [
      { label: "Knowledge bases (Inform)", guest: false, creator: "2 KBs · 50 MB", sponsor: "Unlimited · 5 GB" },
      { label: "Prompts (Instruct)", guest: false, creator: "Up to 5", sponsor: "Unlimited" },
      { label: "MCP Tools (Empower)", guest: false, creator: false, sponsor: true },
      { label: "Orchestration (Align)", guest: false, creator: false, sponsor: true },
    ],
  },
  {
    category: "Governance",
    features: [
      { label: "Vibes (Safety & Norms)", guest: "View", creator: "View", sponsor: "Create & manage" },
      { label: "Offerings", guest: "Browse", creator: "Browse", sponsor: "Create & manage" },
      { label: "Coins (Tokens)", guest: "View balance", creator: "View balance", sponsor: "Create & manage" },
      { label: "Invitation codes", guest: "Redeem only", creator: "Up to 10", sponsor: "Unlimited" },
      { label: "Vote on proposals", guest: false, creator: true, sponsor: true },
      { label: "Create proposals", guest: false, creator: false, sponsor: true },
    ],
  },
  {
    category: "Experiences",
    features: [
      { label: "Play published games", guest: true, creator: true, sponsor: true },
      { label: "Create experiences", guest: false, creator: "Up to 2", sponsor: "Unlimited" },
      { label: "Scenes / NPCs / Quests / Challenges", guest: false, creator: true, sponsor: true },
      { label: "AI Game Editor", guest: false, creator: "Basic", sponsor: "Full" },
      { label: "Builder (drag-and-drop)", guest: false, creator: false, sponsor: true },
      { label: "Dashboard & Analytics", guest: false, creator: "Basic", sponsor: "Advanced + Real-time" },
      { label: "Leaderboards & Achievements", guest: "View", creator: "Manage", sponsor: "Manage" },
      { label: "Story Arcs / Cycles / World Map", guest: false, creator: "View", sponsor: "Create & manage" },
      { label: "Publish games", guest: false, creator: true, sponsor: true },
    ],
  },
  {
    category: "Movement",
    features: [
      { label: "View public contexts", guest: true, creator: true, sponsor: true },
      { label: "Create contexts", guest: false, creator: false, sponsor: true },
      { label: "Create gatherings", guest: false, creator: false, sponsor: true },
      { label: "Create context roles", guest: false, creator: false, sponsor: true },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────

export function formatPrice(amount: number, period: BillingPeriod): string {
  if (amount === 0) return "Free";
  if (period === "yearly") {
    const perMonth = Math.round((amount / 12) * 100) / 100;
    return `$${perMonth.toFixed(2)}`;
  }
  return `$${amount}`;
}

export function formatBillingLabel(amount: number, period: BillingPeriod): string {
  if (amount === 0) return "Forever";
  if (period === "yearly") return `billed $${amount}/year`;
  return "/month";
}

export function yearlySavings(tier: TierDefinition): number {
  if (tier.pricing.monthly === 0) return 0;
  return tier.pricing.monthly * 12 - tier.pricing.yearly;
}