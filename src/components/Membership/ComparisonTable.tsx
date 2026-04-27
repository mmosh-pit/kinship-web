"use client";

import React, { useState } from "react";
import { COMPARISON, type FeatureEntry } from "@/constants/membership";

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <svg width="16" height="12" viewBox="0 0 14 10" fill="none" className="mx-auto">
        <path d="M1 5l4 4L13 1" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (value === false) {
    return <span className="block w-4 h-0.5 bg-[#FFFFFF29] mx-auto rounded" />;
  }
  return <span className="text-xs text-[#FFFFFFCC] font-avenir">{value}</span>;
}

export const ComparisonTable: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-16 lg:mt-24">
      {/* Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mx-auto flex items-center gap-2 text-sm font-semibold text-[#EB8000] hover:text-[#FF9A2E] transition-colors mb-8"
      >
        {expanded ? "Hide" : "See"} full comparison
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        >
          <path d="M1 1.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Table */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            {/* Header */}
            <thead>
              <tr>
                <th className="text-left py-3 px-4 text-xs text-[#FFFFFF66] uppercase tracking-wider font-avenir font-normal w-[40%]">
                  Feature
                </th>
                <th className="text-center py-3 px-4 text-xs text-[#FFFFFF66] uppercase tracking-wider font-avenir font-normal w-[20%]">
                  Guest
                </th>
                <th className="text-center py-3 px-4 text-xs text-[#FFFFFF66] uppercase tracking-wider font-avenir font-normal w-[20%]">
                  <span className="text-[#EB8000]">Creator</span>
                </th>
                <th className="text-center py-3 px-4 text-xs text-[#FFFFFF66] uppercase tracking-wider font-avenir font-normal w-[20%]">
                  Sponsor
                </th>
              </tr>
            </thead>

            <tbody>
              {COMPARISON.map((group) => (
                <React.Fragment key={group.category}>
                  {/* Category header row */}
                  <tr>
                    <td
                      colSpan={4}
                      className="pt-6 pb-2 px-4 text-xs font-bold text-[#EB8000] uppercase tracking-widest font-poppinsNew"
                    >
                      {group.category}
                    </td>
                  </tr>
                  {/* Feature rows */}
                  {group.features.map((feat: FeatureEntry) => (
                    <tr
                      key={feat.label}
                      className="border-t border-[#FFFFFF0A] hover:bg-[#FFFFFF05] transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-[#FFFFFFCC] font-avenir">
                        {feat.label}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <CellValue value={feat.guest} />
                      </td>
                      <td className="py-3 px-4 text-center bg-[#EB800005]">
                        <CellValue value={feat.creator} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <CellValue value={feat.sponsor} />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
