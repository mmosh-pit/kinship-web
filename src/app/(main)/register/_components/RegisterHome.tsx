"use client";

import { useEffect, useState } from "react";
import styles from "../register.module.css";
import { TIERS, type Billing, type TierId } from "../tiers";
import { TopNav } from "./TopNav";

type Device = "desktop" | "ios" | "android";

export type RegisterHomeProps = {
  tier: TierId;
  billing?: Billing;
  firstName?: string;
  onChangeTier?: () => void;
  onLogout?: () => void;
};

const STUDIO_COPY: Record<TierId, SectionCopy> = {
  guest: {
    eyebrow: "A peek inside",
    title: "Take a tour of the Studio.",
    body: "Walk through the avatar forge, the Kiduna designer, and the economy controls — see what Sponsors and Members get to build.",
    cta: "Start the tour",
    locked: true,
  },
  member: {
    eyebrow: "Yours to make",
    title: "Design your avatars.",
    body: "Mint and shape the faces you wear inside every Kiduna. Your avatar travels with you across the network.",
    cta: "Open the Studio",
  },
  sponsor: {
    eyebrow: "Yours to launch",
    title: "Design avatars and Kidunas.",
    body: "Sculpt the avatars your members wear, and architect the Kidunas they’ll join — economy, governance, and all.",
    cta: "Open the Studio",
  },
};

const EXCHANGE_COPY: Record<TierId, SectionCopy> = {
  guest: {
    eyebrow: "A peek inside",
    title: "Take a tour of the Exchange.",
    body: "See how members discover Kidunas, how Sponsors connect them, and how value flows on-chain. Read-only.",
    cta: "Start the tour",
    locked: true,
  },
  member: {
    eyebrow: "Find your people",
    title: "Search and join Kidunas.",
    body: "Browse thousands of live Kidunas. Filter by movement, region, or interest. Join as many as you want.",
    cta: "Open the Exchange",
  },
  sponsor: {
    eyebrow: "Wire them together",
    title: "Connect your Kidunas.",
    body: "Bridge your Kidunas to others. Set up cross-network economies, shared treasuries, and federated governance.",
    cta: "Open the Exchange",
  },
};

type SectionCopy = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  locked?: boolean;
};

function detectDevice(): Device {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

export default function RegisterHome({
  tier,
  firstName,
  onChangeTier,
  onLogout,
}: RegisterHomeProps) {
  const tierObj = TIERS[tier];
  const [device, setDevice] = useState<Device>("desktop");

  useEffect(() => {
    setDevice(detectDevice());
  }, []);

  return (
    <>
      <TopNav
        step="home"
        tier={tier}
        onChangeTier={onChangeTier}
        onLogout={onLogout}
      />

      <header className={styles.homeHero}>
        <div
          className={styles.eyebrow}
          style={{ color: tierObj.accent, marginBottom: 18 }}
        >
          You’re in · {tierObj.name}
        </div>
        <h1 className={styles.titleHome}>
          {firstName ? `Welcome, ${firstName}.` : "Welcome."}{" "}
          <em className={styles.titleEmph}>Let’s get you set up.</em>
        </h1>
        <p className={styles.subtitleHome}>
          Your account is live. Three things to do next — start anywhere.
        </p>
      </header>

      <MobileBlock device={device} tier={tier} />

      <div className={styles.dualGrid}>
        <SectionCard
          accentColor={tierObj.accent}
          accentSoft={tierObj.accentSoft}
          product="Studio"
          copy={STUDIO_COPY[tier]}
          coverArt={<StudioCover tier={tier} />}
          stepLabel="Step 02"
          tier={tier}
        />
        <SectionCard
          accentColor={tierObj.accent}
          accentSoft={tierObj.accentSoft}
          product="Exchange"
          copy={EXCHANGE_COPY[tier]}
          coverArt={<ExchangeCover tier={tier} />}
          stepLabel="Step 03"
          tier={tier}
        />
      </div>

      <div className={styles.homeFooter}>
        <div className={styles.homeFooterLeft}>
          Want a different tier?{" "}
          <button
            type="button"
            className={styles.homeFooterLink}
            onClick={onChangeTier}
          >
            Change in Settings →
          </button>
        </div>
      </div>
    </>
  );
}

// ---------- Mobile block ----------

function MobileBlock({ device, tier }: { device: Device; tier: TierId }) {
  const tierObj = TIERS[tier];
  return (
    <section
      className={`${styles.mobileBlock} ${
        device === "desktop" ? styles.mobileBlockDesktop : ""
      }`}
      style={
        {
          ["--mobile-accent-soft" as never]: tierObj.accentSoft,
        } as React.CSSProperties
      }
    >
      <div className={styles.mobileBlockText}>
        <div className={styles.stepRow}>
          <span className={styles.stepLabel}>Step 01</span>
          <span className={styles.stepLine} />
        </div>
        <h2 className={styles.mobileBlockTitle}>
          Get the <em className={styles.titleEmph}>Kiduna</em> mobile app.
        </h2>
        <p className={styles.mobileBlockBody}>
          The block lives in your pocket. Push notifications when your Kidunas
          move, mobile-first avatar capture, on-chain signing in two taps.
        </p>

        {device === "desktop" && <DesktopDownload />}
        {device === "ios" && <SingleStoreCTA kind="ios" />}
        {device === "android" && <SingleStoreCTA kind="android" />}
      </div>

      {device === "desktop" && (
        <div className={styles.phoneMockWrap}>
          <PhoneMock tier={tier} />
        </div>
      )}
    </section>
  );
}

function DesktopDownload() {
  return (
    <div className={styles.desktopDownload}>
      <div className={styles.storeRow}>
        <AppStoreButton kind="ios" />
        <AppStoreButton kind="android" />
      </div>
      <div className={styles.orRow}>
        <span className={styles.orLine} />
        <span>Or send a link to your phone</span>
        <span className={styles.orLine} />
      </div>
      <div className={styles.smsWrap}>
        <PhoneSMSForm />
      </div>
    </div>
  );
}

function SingleStoreCTA({ kind }: { kind: "ios" | "android" }) {
  return (
    <div className={styles.singleStoreCta}>
      <AppStoreButton kind={kind} />
      <div className={styles.singleStoreNote}>
        Detected: {kind === "ios" ? "iPhone" : "Android"} · we picked the right
        store for you.
      </div>
    </div>
  );
}

function AppStoreButton({ kind }: { kind: "ios" | "android" }) {
  const isIos = kind === "ios";
  return (
    <a className={styles.storeBtn} href="#" onClick={(e) => e.preventDefault()}>
      {isIos ? (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden>
          <path d="M16.365 1.43c0 1.14-.493 2.272-1.234 3.09-.793.881-2.106 1.557-3.196 1.475-.116-1.072.487-2.184 1.207-2.918.766-.78 2.066-1.395 3.223-1.647zM20.5 17.36c-.34.78-.5 1.13-.93 1.82-.6.96-1.45 2.16-2.5 2.17-.94.01-1.18-.61-2.45-.6-1.27 0-1.54.61-2.48.6-1.05-.01-1.86-1.09-2.46-2.05C7.04 16.69 6.83 13 8.06 11.21c.87-1.27 2.25-2 3.55-2 1.32 0 2.16.74 3.25.74 1.06 0 1.7-.74 3.23-.74 1.16 0 2.39.63 3.27 1.72-2.87 1.57-2.4 5.67-.86 6.43z" />
        </svg>
      ) : (
        <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M3.6 2.3c-.36.32-.57.82-.57 1.46v16.48c0 .64.21 1.14.57 1.46l9.07-9.7L3.6 2.3z"
            fill="#03CCD9"
          />
          <path
            d="M16.06 8.65 13.6 11.32l-9.5-9.43c.43.04.92.27 1.5.6L16.06 8.65z"
            fill="#FFCA05"
          />
          <path
            d="M16.06 15 5.6 21.5c-.58.33-1.07.56-1.5.6l9.5-9.43L16.06 15z"
            fill="#EC008C"
          />
          <path
            d="M19.96 11 17.1 9.4l-3 3 3 3 2.86-1.6c1.18-.66 1.18-2.14 0-2.8z"
            fill="#F7941D"
          />
        </svg>
      )}
      <div className={styles.storeText}>
        <span className={styles.storeKicker}>
          {isIos ? "Download on the" : "GET IT ON"}
        </span>
        <span className={styles.storeName}>
          {isIos ? "App Store" : "Google Play"}
        </span>
      </div>
    </a>
  );
}

function PhoneSMSForm() {
  const [val, setVal] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <form
      className={styles.smsForm}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 2400);
      }}
    >
      <div className={styles.smsField}>
        <span className={styles.smsCountry}>+1</span>
        <input
          type="tel"
          placeholder="(555) 123-4567"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className={styles.smsInput}
        />
      </div>
      <button type="submit" className={styles.smsBtn}>
        {sent ? "Sent ✓" : "Send link →"}
      </button>
    </form>
  );
}

// ---------- Phone mock ----------

function PhoneMock({ tier }: { tier: TierId }) {
  const tierObj = TIERS[tier];
  const cards: { c: string; title: string; meta: string }[] = [
    { c: "#F7941D", title: "Salton Sea", meta: "+$120" },
    { c: "#03CCD9", title: "OpenWeights", meta: "+$45" },
    { c: "#EC008C", title: "Block Garden", meta: "+$25" },
  ];
  return (
    <div
      className={styles.phoneMock}
      style={
        {
          ["--phone-accent-soft" as never]: tierObj.accentSoft,
        } as React.CSSProperties
      }
    >
      <div className={styles.phoneNotch} />
      <div className={styles.phoneScreen}>
        <div className={styles.phoneTopRow}>
          <span className={styles.phoneBrand}>kinship</span>
          <div
            className={styles.phoneAvatar}
            style={{ background: tierObj.accent }}
          />
        </div>
        <div className={styles.phoneTitle}>
          The block, <em className={styles.titleEmph}>in your pocket.</em>
        </div>
        <div className={styles.phoneCardList}>
          {cards.map((x, i) => (
            <div key={i} className={styles.phoneCard}>
              <div
                className={styles.phoneCardIcon}
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${x.c}, #09073A)`,
                }}
              />
              <div className={styles.phoneCardTitle}>{x.title}</div>
              <div className={styles.phoneCardMeta}>{x.meta}</div>
            </div>
          ))}
        </div>
        <div className={styles.phoneNav}>
          {["◐", "◇", "◑", "◈"].map((g, i) => (
            <span
              key={i}
              style={{
                color: i === 0 ? tierObj.accent : "rgba(255,255,255,0.35)",
              }}
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Section card ----------

function SectionCard({
  product,
  copy,
  coverArt,
  stepLabel,
  accentColor,
}: {
  product: "Studio" | "Exchange";
  copy: SectionCopy;
  coverArt: React.ReactNode;
  stepLabel: string;
  accentColor: string;
  accentSoft: string;
  tier: TierId;
}) {
  return (
    <article className={styles.sectionCard}>
      <div className={styles.sectionCover}>
        {coverArt}
        {copy.locked && (
          <span className={styles.sectionLockBadge}>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden
            >
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 1 1 8 0v4" />
            </svg>
            Tour mode
          </span>
        )}
        <span className={styles.sectionStep}>{stepLabel}</span>
      </div>
      <div className={styles.sectionBody}>
        <div>
          <div
            className={styles.sectionEyebrow}
            style={{ color: accentColor }}
          >
            Kiduna {product} · {copy.eyebrow}
          </div>
          <h3 className={styles.sectionTitle}>{copy.title}</h3>
        </div>
        <p className={styles.sectionText}>{copy.body}</p>
        <div className={styles.sectionCtaRow}>
          <span
            className={styles.sectionCta}
            style={{ color: copy.locked ? "#fff" : accentColor }}
          >
            {copy.cta}
            <span className={styles.sectionCtaArrow}>→</span>
          </span>
          {!copy.locked && (
            <span className={styles.sectionDomain}>
              {product === "Studio"
                ? "studio.kinship.systems"
                : "exchange.kinship.systems"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ---------- Cover art ----------

function StudioCover({ tier }: { tier: TierId }) {
  const tierObj = TIERS[tier];
  const avatars: { c: string; shape: "circle" | "square" }[] = [
    { c: "#F7941D", shape: "circle" },
    { c: "#03CCD9", shape: "square" },
    { c: "#EC008C", shape: "circle" },
    { c: "#FFCA05", shape: "circle" },
    { c: "#6536BB", shape: "square" },
  ];
  const labels = ["M", "A", "Y", "A", "+"];
  return (
    <div
      className={styles.coverBase}
      style={{
        background: `radial-gradient(420px 200px at 30% 30%, ${tierObj.accentSoft}, transparent 60%), linear-gradient(135deg, #100E59, #03011B)`,
      }}
    >
      <svg className={styles.coverGrid}>
        <defs>
          <pattern
            id={`grid-studio-${tier}`}
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-studio-${tier})`} />
      </svg>

      <div className={styles.avatarRow}>
        {avatars.map((a, i) => {
          const big = i === 2;
          return (
            <div
              key={i}
              className={styles.avatarBubble}
              style={{
                width: big ? 62 : 48,
                height: big ? 62 : 48,
                borderRadius: a.shape === "circle" ? "50%" : 12,
                background: `radial-gradient(circle at 30% 30%, ${a.c}, ${a.c}33 70%, transparent)`,
                border: `1.5px solid ${a.c}`,
                opacity: tier === "guest" ? 0.55 : 1,
                filter: tier === "guest" ? "grayscale(0.4)" : "none",
                boxShadow: big ? `0 0 30px ${a.c}66` : "none",
              }}
            >
              {labels[i]}
            </div>
          );
        })}
      </div>

      {tier === "sponsor" && (
        <div className={styles.kidunaGem}>K</div>
      )}
    </div>
  );
}

function ExchangeCover({ tier }: { tier: TierId }) {
  const tierObj = TIERS[tier];
  const nodes = [
    { x: 22, y: 30, c: "#F7941D", s: 18 },
    { x: 50, y: 22, c: "#03CCD9", s: 22 },
    { x: 76, y: 38, c: "#EC008C", s: 16 },
    { x: 32, y: 64, c: "#FFCA05", s: 20 },
    { x: 64, y: 70, c: "#6536BB", s: 18 },
    { x: 88, y: 68, c: "#BEEF00", s: 14 },
  ];
  const lineColor =
    tier === "sponsor" ? "#EC008C" : tier === "guest" ? "rgba(255,255,255,0.15)" : "#03CCD9";
  return (
    <div
      className={styles.coverBase}
      style={{
        background: `radial-gradient(420px 200px at 70% 50%, ${tierObj.accentSoft}, transparent 60%), linear-gradient(135deg, #03011B, #100E59)`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={styles.coverGrid}
      >
        <g
          stroke={lineColor}
          strokeWidth="0.3"
          opacity={tier === "guest" ? 1 : 0.5}
          fill="none"
          strokeDasharray={tier === "guest" ? "1 1" : undefined}
        >
          <line x1="22" y1="30" x2="50" y2="22" />
          <line x1="50" y1="22" x2="76" y2="38" />
          <line x1="22" y1="30" x2="32" y2="64" />
          <line x1="32" y1="64" x2="64" y2="70" />
          <line x1="64" y1="70" x2="76" y2="38" />
          {tier === "sponsor" && (
            <>
              <line x1="50" y1="22" x2="32" y2="64" strokeDasharray="1 1" />
              <line x1="76" y1="38" x2="88" y2="68" strokeDasharray="1 1" />
              <line x1="64" y1="70" x2="88" y2="68" />
            </>
          )}
        </g>
        {nodes.map((n, i) => (
          <g key={i} opacity={tier === "guest" ? 0.5 : 1}>
            <circle cx={n.x} cy={n.y} r={n.s / 8 + 1.5} fill={n.c} opacity="0.18" />
            <circle cx={n.x} cy={n.y} r={n.s / 12 + 0.6} fill={n.c} />
          </g>
        ))}
      </svg>
      <div className={styles.coverLabels}>
        <span>
          {tier === "guest"
            ? "6 Kidunas visible"
            : tier === "sponsor"
              ? "4 of yours · 412 connectable"
              : "2,481 Kidunas live"}
        </span>
        <span>$KIN flowing</span>
      </div>
    </div>
  );
}
