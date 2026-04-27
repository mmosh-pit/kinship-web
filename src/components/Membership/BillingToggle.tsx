"use client";

import React from "react";
import type { BillingPeriod } from "@/constants/membership";

interface BillingToggleProps {
  period: BillingPeriod;
  onChange: (period: BillingPeriod) => void;
}

export const BillingToggle: React.FC<BillingToggleProps> = ({
  period,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-center gap-1">
      <div className="relative flex items-center bg-[#0D0B3E] rounded-full p-1 border border-[#FFFFFF14]">
        <button
          onClick={() => onChange("monthly")}
          className={`relative z-10 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            period === "monthly"
              ? "text-white"
              : "text-[#FFFFFF66] hover:text-[#FFFFFF99]"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => onChange("yearly")}
          className={`relative z-10 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
            period === "yearly"
              ? "text-white"
              : "text-[#FFFFFF66] hover:text-[#FFFFFF99]"
          }`}
        >
          Yearly
          <span className="text-[10px] font-bold text-[#34D399] bg-[#34D39915] px-2 py-0.5 rounded-full">
            SAVE
          </span>
        </button>

        {/* Sliding pill background */}
        <span
          className="absolute top-1 bottom-1 rounded-full bg-[#EB8000] transition-all duration-300 ease-in-out"
          style={{
            left: period === "monthly" ? "4px" : "50%",
            width: "calc(50% - 4px)",
          }}
        />
      </div>
    </div>
  );
};
