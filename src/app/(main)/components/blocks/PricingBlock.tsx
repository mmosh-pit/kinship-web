"use client";

import { renderWithLineBreaks } from "../renderWithLineBreaks";

type PricingFeature = { text?: string };
type Plan = {
  name?: string;
  price?: string;
  priceDetail?: string;
  description?: string;
  features?: PricingFeature[];
  ctaText?: string;
  ctaUrl?: string;
  highlighted?: boolean;
};

type Props = {
  block: Record<string, any>;
  onScrollToEarlyAccess: () => void;
};

export function PricingBlock({ block, onScrollToEarlyAccess }: Props) {
  const plans: Plan[] = block.plans || [];
  const sectionId =
    block.sectionId ||
    (block.blockName ? block.blockName.toLowerCase().replace(/\s+/g, "-") : undefined);

  const colsClass =
    plans.length >= 4
      ? "grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1"
      : plans.length === 3
      ? "grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1"
      : plans.length === 2
      ? "grid-cols-2 max-md:grid-cols-1"
      : "grid-cols-1 max-w-[25rem] mx-auto";

  return (
    <div
      id={sectionId}
      className="px-4 md:px-8 mt-[3rem] max-md:mt-8 scroll-mt-[120px]"
    >
      {block.sectionTitle && (
        <h1 className="text-center font-bold xl:px-10 leading-tight xl:w-[65.063rem] text-[3.75rem] max-xl:text-5xl max-md:text-4xl max-sm:text-2xl m-auto font-goudy bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text pb-[0.15em]">
          {renderWithLineBreaks(block.sectionTitle)}
        </h1>
      )}

      {block.description && (
        <p className="max-md:text-sm font-avenir text-center text-[#FFFFFFC7] mt-[1rem] xl:w-[64.313rem] mx-auto">
          {renderWithLineBreaks(block.description)}
        </p>
      )}

      <div
        className={`container mx-auto grid ${colsClass} gap-5 px-3 max-xl:mt-5 xl:mt-10 mb-4 xl:max-w-[79.5rem] items-stretch`}
      >
        {plans.map((plan, i) => {
          const borderClass = plan.highlighted
            ? "bg-[linear-gradient(96.69deg,#ff29c3_0%,#0765ff_100%)]"
            : "bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)]";
          const innerPadding = plan.highlighted ? "p-[2px]" : "p-[1px]";
          return (
            <div
              key={i}
              className={`relative ${borderClass} ${innerPadding} rounded-xl ${
                plan.highlighted
                  ? "shadow-[0_0_30px_rgba(255,41,195,0.25)]"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[linear-gradient(96.69deg,#ff29c3_0%,#0765ff_100%)] text-white text-xs font-bold font-avenirNext px-4 py-1 rounded-full uppercase tracking-[0.15em] z-10 whitespace-nowrap">
                  Recommended
                </span>
              )}
              <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl py-8 px-6 h-full flex flex-col">
                {plan.name && (
                  <p className="text-white font-bold text-xl font-avenirNext">
                    {plan.name}
                  </p>
                )}
                {plan.price && (
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-goudy font-bold text-[3rem] leading-none bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent pb-[0.15em]">
                      {plan.price}
                    </span>
                    {plan.priceDetail && (
                      <span className="text-[#CDCDCDE5] font-avenir text-sm">
                        {plan.priceDetail}
                      </span>
                    )}
                  </div>
                )}
                {plan.description && (
                  <p className="text-[#CDCDCDE5] font-avenir text-sm leading-relaxed mt-3">
                    {renderWithLineBreaks(plan.description)}
                  </p>
                )}
                {plan.features && plan.features.length > 0 && (
                  <ul className="mt-5 flex flex-col gap-2.5 flex-1">
                    {plan.features.map((f, fi) => (
                      <li
                        key={fi}
                        className="text-[#FFFFFFC7] font-avenir text-[0.95rem] flex items-start gap-2.5"
                      >
                        <svg
                          className="w-4 h-4 mt-1 shrink-0"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs>
                            <linearGradient id={`check-${i}-${fi}`} x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
                              <stop offset="0" stopColor="#ff29c3" />
                              <stop offset="1" stopColor="#0765ff" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M3 8.5L6.5 12L13 4.5"
                            stroke={`url(#check-${i}-${fi})`}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{f.text && renderWithLineBreaks(f.text)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-6">
                  {plan.ctaUrl ? (
                    <a
                      href={plan.ctaUrl}
                      className={`btn w-full border-none inline-flex items-center justify-center ${
                        plan.highlighted
                          ? "bg-[#EB8000] text-white hover:bg-[#EB8000]"
                          : "bg-transparent text-white border border-white/30 hover:bg-white/5 hover:border-white/50"
                      }`}
                    >
                      {plan.ctaText || "Get Started"}
                    </a>
                  ) : (
                    <button
                      onClick={onScrollToEarlyAccess}
                      className={`btn w-full ${
                        plan.highlighted
                          ? "bg-[#EB8000] text-white border-none hover:bg-[#EB8000]"
                          : "bg-transparent text-white border border-white/30 hover:bg-white/5 hover:border-white/50"
                      }`}
                    >
                      {plan.ctaText || "Get Started"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
