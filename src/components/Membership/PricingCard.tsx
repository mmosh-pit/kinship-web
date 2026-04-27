"use client";

import React from "react";
import type { TierDefinition, BillingPeriod } from "@/constants/membership";
import { formatPrice, formatBillingLabel, yearlySavings } from "@/constants/membership";
import { FeatureList } from "./FeatureList";

interface PricingCardProps {
  tier: TierDefinition;
  billingPeriod: BillingPeriod;
  onSelect: (tierId: string, period: BillingPeriod) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  billingPeriod,
  onSelect,
}) => {
  const price = formatPrice(
    billingPeriod === "yearly" ? tier.pricing.yearly : tier.pricing.monthly,
    billingPeriod,
  );
  const billingLabel = formatBillingLabel(
    billingPeriod === "yearly" ? tier.pricing.yearly : tier.pricing.monthly,
    billingPeriod,
  );
  const savings = yearlySavings(tier);
  const showSavings = billingPeriod === "yearly" && savings > 0;

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-6 lg:p-8 transition-all duration-300 ${
        tier.highlighted
          ? "bg-[#100E59] border-2 border-[#EB8000] shadow-[0_0_40px_rgba(235,128,0,0.15)]"
          : "bg-[#0D0B3E] border border-[#FFFFFF14] hover:border-[#FFFFFF29]"
      }`}
    >
      {/* Badge */}
      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#EB8000] text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide uppercase">
            {tier.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-poppinsNew text-xl font-bold text-white mb-1">
          {tier.name}
        </h3>
        <p className="text-sm text-[#FFFFFF99] font-avenir">{tier.tagline}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="font-poppinsNew text-4xl font-bold text-white tracking-tight">
            {price}
          </span>
          {tier.pricing.monthly > 0 && (
            <span className="text-sm text-[#FFFFFF66] font-avenir">
              {billingPeriod === "yearly" ? "/mo" : billingLabel}
            </span>
          )}
        </div>
        {billingPeriod === "yearly" && tier.pricing.yearly > 0 && (
          <p className="text-xs text-[#FFFFFF66] mt-1 font-avenir">
            {billingLabel}
          </p>
        )}
        {showSavings && (
          <span className="inline-block mt-2 text-xs font-semibold text-[#34D399] bg-[#34D39910] px-3 py-1 rounded-full">
            Save ${savings}/year
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#FFFFFF14] mb-6" />

      {/* Features */}
      <div className="flex-1 mb-8">
        <FeatureList features={tier.shortFeatures} />
      </div>

      {/* CTA */}
      <button
        onClick={() => onSelect(tier.id, billingPeriod)}
        data-tier={tier.id}
        data-period={billingPeriod}
        className={`w-full py-3 rounded-full font-bold text-sm transition-all duration-200 ${
          tier.ctaVariant === "primary"
            ? "bg-[#EB8000] hover:bg-[#D47200] text-white shadow-[0_4px_20px_rgba(235,128,0,0.3)]"
            : "bg-transparent border-2 border-[#FFFFFF29] text-white hover:border-[#FFFFFF66] hover:bg-[#FFFFFF08]"
        }`}
      >
        {tier.ctaLabel}
      </button>
    </div>
  );
};