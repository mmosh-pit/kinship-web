"use client";

import React from "react";

interface FeatureListProps {
  features: string[];
}

export const FeatureList: React.FC<FeatureListProps> = ({ features }) => {
  return (
    <ul className="space-y-3">
      {features.map((feature, i) => {
        const isInherit = feature.startsWith("Everything in");
        return (
          <li key={i} className="flex items-start gap-2.5">
            {isInherit ? (
              <span className="mt-0.5 shrink-0 w-4 h-4 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1v12M1 7h12"
                    stroke="#EB8000"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            ) : (
              <span className="mt-0.5 shrink-0 w-4 h-4 flex items-center justify-center">
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path
                    d="M1 5l4 4L13 1"
                    stroke="#34D399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
            <span
              className={`text-sm leading-snug ${
                isInherit
                  ? "text-[#EB8000] font-semibold"
                  : "text-[#FFFFFFCC]"
              }`}
            >
              {feature}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
