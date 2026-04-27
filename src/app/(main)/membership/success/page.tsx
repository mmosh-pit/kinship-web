"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { agentApi } from "@/lib/agentApi";
import KinshipBots from "../../../../../public/assets/icons/KinshipBots";

/**
 * /membership/success
 *
 * Post-membership welcome page with two paths:
 *   1. Enter the Studio (recommended)
 *   2. Download the mobile app
 *
 * Tier badge reads from localStorage "selectedTier" (set by /membership page).
 * Defaults to "guest" if not set.
 *
 * Payment verification: On mount, calls the billing API to confirm the
 * membership tier and stores the confirmed data in localStorage.
 */

/* ── Env-based URLs ─────────────────────────────────────────────────────── */

const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || "#";
const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL || "#";
const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "/";

/* ── Tier config ────────────────────────────────────────────────────────── */

const TIER_STYLE: Record<string, { label: string; cls: string }> = {
  guest:   { label: "Guest",   cls: "border-white/20 text-white/60 bg-white/[0.04]" },
  creator: { label: "Creator", cls: "border-[#EB8000]/40 text-[#EB8000] bg-[#EB8000]/[0.07]" },
  sponsor: { label: "Sponsor", cls: "border-[#F5C542]/40 text-[#F5C542] bg-[#F5C542]/[0.07]" },
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}

function capitalize(s: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function MembershipSuccessPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [tier, setTier] = useState("guest");
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [ready, setReady] = useState(false);

  useEffect(() => { (async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
      return;
    }

    // Read user name
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        const name: string = u.name || u.fullName || u.firstName || "";
        setFirstName(capitalize(name.split(" ")[0]));

      }
    } catch {
      /* ignore */
    }

    // Verify payment via billing API and store confirmed tier
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        const userId = u.id;
        if (userId) {
          const res = await agentApi.get(`/api/v1/billing/membership/${userId}`);
          const data = res.data;
          if (data.status === "active" && data.tier !== "guest") {
            localStorage.setItem("membership", JSON.stringify(data));
            localStorage.setItem("membership_tier", data.tier);
            localStorage.setItem("selectedTier", data.tier);
            setTier(data.tier);
          } else {
            setTier(localStorage.getItem("selectedTier") || "guest");
          }
        } else {
          setTier(localStorage.getItem("selectedTier") || "guest");
        }
      } else {
        setTier(localStorage.getItem("selectedTier") || "guest");
      }
    } catch {
      // API unreachable — fall back to locally stored tier
      setTier(localStorage.getItem("selectedTier") || "guest");
    }

    setPlatform(detectPlatform());
    setReady(true);
  })(); }, [router]);

  if (!ready) {
    return (
      <section className="min-h-screen bg-[#050824] flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-10 h-10 border-2 border-[#EB8000] border-t-transparent rounded-full animate-spin" />
          </div>
          <h1 className="font-poppinsNew text-2xl font-bold text-white mb-3">
            Confirming your membership...
          </h1>
          <p className="text-white/45 font-avenir text-sm">
            Please wait while we verify your payment.
          </p>
        </div>
      </section>
    );
  }

  const badge = TIER_STYLE[tier] || null;

  return (
    <section className="relative min-h-screen bg-[#050824] overflow-hidden">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-[-200px] left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-[#EB8000]/[0.03] blur-[130px]" />

      <div className="relative z-10 max-w-[740px] mx-auto px-5 pt-10 pb-20">

        {/* Logo */}
        <div className="flex justify-center mb-12">
          <KinshipBots />
        </div>

        {/* ═══════════════ Header ═══════════════ */}
        <div className="text-center mb-10">

          {/* Checkmark */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute w-[86px] h-[86px] rounded-full border border-[#EB8000]/15" />
            <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-[#EB8000] to-[#D47200] flex items-center justify-center shadow-[0_6px_30px_rgba(235,128,0,0.3)]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          {/* Greeting */}
          <h1 className="font-poppinsNew text-[1.85rem] md:text-[2.3rem] font-bold text-white leading-tight mb-2">
            {firstName
              ? <>Welcome<h1 className="text-[#EB8000]">{firstName}</h1></>
              : <>You&apos;re <h1 className="text-[#EB8000]">all set</h1></>
            }
          </h1>

          <p className="text-white/45 font-avenir text-base leading-relaxed max-w-sm mx-auto">
            Your Kinship account is ready. Choose how you&apos;d like to begin.
          </p>

          {/* Tier badge */}
          {badge && (
            <span className={`inline-block mt-4 text-[0.6rem] font-bold tracking-[0.16em] uppercase px-4 py-1.5 rounded-full border ${badge.cls}`}>
              {badge.label} membership
            </span>
          )}
        </div>

        {/* ═══════════════ Cards — Side by Side ═══════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">

          {/* ── Card 1: Enter the Studio ── */}
          <div className="relative rounded-2xl border border-[#EB8000]/25 bg-gradient-to-b from-[#100E55] to-[#0A0838] p-6 pb-7 flex flex-col hover:border-[#EB8000]/40 transition-all duration-200 shadow-[inset_0_1px_0_rgba(235,128,0,0.06)]">

            {/* Badge */}
            <span className="absolute -top-2.5 left-5 bg-[#EB8000] text-white text-[8px] font-bold tracking-[0.14em] uppercase px-2.5 py-[4px] rounded-full shadow-sm shadow-[#EB8000]/20">
              Recommended
            </span>

            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-[#EB8000]/10 flex items-center justify-center mb-4 mt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EB8000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>

            <h2 className="font-poppinsNew text-[1.1rem] font-bold text-white leading-snug mb-0.5">
              Enter the Studio
            </h2>
            <p className="text-[0.7rem] text-white/25 font-avenir mb-3">Web experience</p>

            <p className="text-white/40 font-avenir text-[0.82rem] leading-relaxed mb-6 flex-1">
              Create your Kinship Avatar, build movements, manage your wallet, and set up your presence.
            </p>

            {/* CTA */}
            <a
              href={STUDIO_URL}
              className="w-full flex items-center justify-center gap-2 bg-[#EB8000] hover:bg-[#D47200] active:brightness-90 text-white text-[0.85rem] font-bold font-avenirNext py-3 rounded-xl transition-all duration-150 shadow-[0_4px_16px_rgba(235,128,0,0.25)]"
            >
              Open Studio
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <p className="text-center text-[0.65rem] text-white/20 font-avenir mt-2">
              Start by setting up your Kinship Avatar
            </p>
          </div>

          {/* ── Card 2: Download the App ── */}
          <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#100E55] to-[#0A0838] p-6 pb-7 flex flex-col hover:border-white/[0.12] transition-all duration-200">

            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-[#EB8000]/[0.08] flex items-center justify-center mb-4 mt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EB8000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </div>

            <h2 className="font-poppinsNew text-[1.1rem] font-bold text-white leading-snug mb-0.5">
              Download the App
            </h2>
            <p className="text-[0.7rem] text-white/25 font-avenir mb-3">Mobile experience</p>

            <p className="text-white/40 font-avenir text-[0.82rem] leading-relaxed mb-6 flex-1">
              Chat with avatars, discover movements, and start earning &mdash; all from your phone.
            </p>

            {/* Store buttons */}
            <div className="flex flex-wrap gap-2.5">
              {(platform === "ios" || platform === "desktop") && (
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[130px] flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] hover:border-white/[0.14] rounded-xl py-2.5 px-3 transition-all duration-150"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="opacity-70 flex-shrink-0"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <div className="leading-tight text-left">
                    <span className="block text-[8px] text-white/30 font-avenir">Download on the</span>
                    <span className="block text-[0.78rem] text-white/80 font-avenirNext font-semibold -mt-px">App Store</span>
                  </div>
                </a>
              )}
              {(platform === "android" || platform === "desktop") && (
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[130px] flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] hover:border-white/[0.14] rounded-xl py-2.5 px-3 transition-all duration-150"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="opacity-70 flex-shrink-0"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.395 12l2.302-2.492zM5.864 2.658L16.8 8.991l-2.302 2.302L5.864 2.658z"/></svg>
                  <div className="leading-tight text-left">
                    <span className="block text-[8px] text-white/30 font-avenir">Get it on</span>
                    <span className="block text-[0.78rem] text-white/80 font-avenirNext font-semibold -mt-px">Google Play</span>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════ What's Next ═══════════════ */}
        <div className="rounded-xl bg-white/[0.015] border border-white/[0.04] px-6 py-5 mb-10">
          <p className="text-[0.6rem] text-white/20 font-avenir font-bold tracking-[0.2em] uppercase mb-4">
            What happens next
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { n: "1", title: "Set up your Avatar", desc: "Name, describe, and personalize your AI presence" },
              { n: "2", title: "Join a Movement", desc: "Find communities aligned with your values" },
              { n: "3", title: "Start Earning", desc: "Contribute, vote, and earn through participation" },
            ].map((s) => (
              <div key={s.n} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#EB8000]/[0.07] border border-[#EB8000]/15 flex items-center justify-center text-[0.65rem] font-bold text-[#EB8000]/70">
                  {s.n}
                </span>
                <div className="min-w-0">
                  <p className="text-[0.78rem] text-white/60 font-avenirNext font-semibold leading-snug">{s.title}</p>
                  <p className="text-[0.68rem] text-white/25 font-avenir leading-snug mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[0.68rem] text-white/15 font-avenir">
          You can switch between the app and studio anytime from your account.
        </p>
      </div>
    </section>
  );
}