"use client";

import { useState, type CSSProperties } from "react";
import styles from "../register.module.css";
import {
  TIERS,
  TIER_ORDER,
  type Billing,
  type Tier,
  type TierId,
} from "../tiers";
import { TopNav } from "./TopNav";

export type TierPickerProps = {
  initialBilling?: Billing;
  onPick: (id: TierId, billing: Billing) => void;
  pickingId?: TierId | null;
};

export default function TierPicker({
  initialBilling = "monthly",
  onPick,
  pickingId = null,
}: TierPickerProps) {
  const [billing, setBilling] = useState<Billing>(initialBilling);

  return (
    <>
      <TopNav step="picker" />

      <header className={styles.hero}>
        <div className={styles.eyebrow}>Welcome to Kinship</div>
        <h1 className={styles.title}>
          Pick how you want{" "}
          <em className={styles.titleEmph}>to belong.</em>
        </h1>
        <p className={styles.subtitle}>
          Three ways into Kinship. You can change your mind any time from
          Settings — nothing locks you out of yourself.
        </p>
      </header>

      <div className={styles.toggleWrap}>
        <div className={styles.toggle} role="tablist" aria-label="Billing period">
          {(["monthly", "yearly"] as Billing[]).map((b) => (
            <button
              key={b}
              type="button"
              role="tab"
              aria-selected={billing === b}
              onClick={() => setBilling(b)}
              className={`${styles.toggleBtn} ${
                billing === b ? styles.toggleBtnActive : ""
              }`}
            >
              {b}
              {b === "yearly" && <span className={styles.savings}>SAVE 17%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {TIER_ORDER.map((id) => (
          <TierCard
            key={id}
            tier={TIERS[id]}
            billing={billing}
            featured={id === "member"}
            isLoading={pickingId === id}
            disabled={pickingId !== null && pickingId !== id}
            onPick={(picked) => onPick(picked, billing)}
          />
        ))}
      </div>

      <p className={styles.footnote}>
        Pay in USD or $KIN · Cancel any time · Your wallet, your data
      </p>
    </>
  );
}

function TierCard({
  tier,
  billing,
  featured,
  isLoading,
  disabled,
  onPick,
}: {
  tier: Tier;
  billing: Billing;
  featured: boolean;
  isLoading: boolean;
  disabled: boolean;
  onPick: (id: TierId) => void;
}) {
  const isFree = tier.monthly === 0;
  const price = billing === "monthly" ? tier.monthly : tier.yearly;
  const cycle = billing === "monthly" ? "/mo" : "/yr";
  const altCycle =
    billing === "monthly"
      ? tier.yearly > 0
        ? `or $${tier.yearly}/yr`
        : null
      : tier.monthly > 0
        ? `or $${tier.monthly}/mo`
        : null;

  const cardStyle = featured
    ? ({
        ["--featured-soft" as never]: tier.accentSoft,
        ["--featured-border" as never]: tier.accentBorder,
      } as CSSProperties)
    : undefined;

  const interactive = !disabled && !isLoading;
  return (
    <article
      onClick={() => interactive && onPick(tier.id)}
      className={`${styles.card} ${featured ? styles.cardFeatured : ""}`}
      style={{
        ...cardStyle,
        opacity: disabled ? 0.55 : 1,
        cursor: interactive ? "pointer" : "default",
      }}
    >
      {tier.badge && (
        <span className={styles.badge} style={{ background: tier.accent }}>
          {tier.badge}
        </span>
      )}

      <div>
        <div className={styles.tierLabel} style={{ color: tier.accent }}>
          {tier.name}
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>{isFree ? "Free" : `$${price}`}</span>
          {!isFree && <span className={styles.priceCycle}>{cycle}</span>}
        </div>
        {altCycle && <div className={styles.altCycle}>{altCycle}</div>}

        <p className={styles.tagline}>{tier.tagline}</p>
      </div>

      <div className={styles.divider} />

      <ul className={styles.perks}>
        {tier.perks.map((p, i) => (
          <li key={i} className={styles.perk}>
            <span className={styles.perkArrow} style={{ color: tier.accent }}>
              →
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>

      {tier.limits && <div className={styles.limits}>{tier.limits}</div>}

      <button
        type="button"
        disabled={!interactive}
        onClick={(e) => {
          e.stopPropagation();
          if (interactive) onPick(tier.id);
        }}
        className={`${styles.cta} ${featured ? styles.ctaFeatured : ""}`}
      >
        {isLoading
          ? "Redirecting…"
          : isFree
            ? "Continue as Guest"
            : `Become ${tier.name}`}{" "}
        →
      </button>
    </article>
  );
}
