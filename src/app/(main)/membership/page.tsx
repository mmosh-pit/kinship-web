"use client";

import React, { useState, useEffect } from "react";
import { agentApi } from "@/lib/agentApi";
import { TIERS, type BillingPeriod } from "@/constants/membership";
import { MembershipHero } from "@/components/Membership/MembershipHero";
import { BillingToggle } from "@/components/Membership/BillingToggle";
import { PricingCard } from "@/components/Membership/PricingCard";
import { ComparisonTable } from "@/components/Membership/ComparisonTable";

export default function MembershipPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [firstName, setFirstName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Read user data from localStorage (set during onboarding Step 8)
  useEffect(() => {
    try {
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const user = JSON.parse(userRaw);
        setFirstName(user.name?.split(" ")[0] || "");
        setUserId(user.id || "");
      }
    } catch {
      // No user data — that's fine, show generic heading
    }
  }, []);

  const handleSelect = async (tierId: string, period: BillingPeriod) => {
    if (!userId) {
      setError("User session not found. Please complete onboarding first.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (tierId === "guest") {
        await agentApi.post("/api/v1/billing/guest", { userId });
        localStorage.setItem("membership_tier", "guest");
        window.location.href =
          process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3003/agents";
        return;
      }

      const res = await agentApi.post("/api/v1/billing/checkout", {
        userId,
        tier: tierId,
        period,
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) {
        setError("You already have an active subscription. Redirecting to manage it...");
        try {
          const portal = await agentApi.post("/api/v1/billing/portal", { userId });
          if (portal.data?.url) {
            window.location.href = portal.data.url;
          }
        } catch {
          setError("Unable to open subscription management. Please try again.");
        }
      } else {
        setError(
          err?.response?.data?.detail || "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#050824] px-4 py-16 lg:py-24 relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#EB8000] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <MembershipHero firstName={firstName} />

        {/* Error */}
        {error && (
          <div className="max-w-md mx-auto mb-8 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Billing Toggle */}
        <div className="mb-10">
          <BillingToggle period={billingPeriod} onChange={setBillingPeriod} />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TIERS.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              billingPeriod={billingPeriod}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Comparison Table */}
        <ComparisonTable />
      </div>
    </section>
  );
}
