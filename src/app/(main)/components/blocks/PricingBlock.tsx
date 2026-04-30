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
        <h1 className="text-center font-bold xl:px-10 leading-tight xl:w-[65.063rem] text-[3.75rem] max-xl:text-5xl max-md:text-4xl max-sm:text-2xl m-auto font-goudy theme-heading-gradient stroke-text">
          {renderWithLineBreaks(block.sectionTitle)}
        </h1>
      )}

      {block.description && (
        <p className="max-md:text-sm font-avenir text-center text-theme-body mt-[1rem] xl:w-[64.313rem] mx-auto">
          {renderWithLineBreaks(block.description)}
        </p>
      )}

      <div
        className={`container mx-auto grid ${colsClass} gap-5 px-3 max-xl:mt-5 xl:mt-10 mb-4 xl:max-w-[79.5rem] items-stretch`}
      >
        {plans.map((plan, i) => {
          const borderClass = plan.highlighted
            ? "theme-accent-gradient-bg"
            : "theme-card-border";
          const innerPadding = plan.highlighted ? "p-[2px]" : "p-[1px]";
          return (
            <div
              key={i}
              className={`relative ${borderClass} ${innerPadding} rounded-xl ${
                plan.highlighted
                  ? "shadow-[0_0_30px_color-mix(in_srgb,var(--theme-accent-from)_25%,transparent)]"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 theme-accent-gradient-bg text-theme-heading text-xs font-bold font-avenirNext px-4 py-1 rounded-full uppercase tracking-[0.15em] z-10 whitespace-nowrap">
                  Recommended
                </span>
              )}
              <div className="theme-card-bg rounded-xl py-8 px-6 h-full flex flex-col">
                {plan.name && (
                  <p className="text-theme-heading font-bold text-xl font-avenirNext">
                    {plan.name}
                  </p>
                )}
                {plan.price && (
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-goudy font-bold text-[3rem] leading-none theme-heading-gradient pb-[0.15em]">
                      {plan.price}
                    </span>
                    {plan.priceDetail && (
                      <span className="text-theme-muted font-avenir text-sm">
                        {plan.priceDetail}
                      </span>
                    )}
                  </div>
                )}
                {plan.description && (
                  <p className="text-theme-muted font-avenir text-sm leading-relaxed mt-3">
                    {renderWithLineBreaks(plan.description)}
                  </p>
                )}
                {plan.features && plan.features.length > 0 && (
                  <ul className="mt-5 flex flex-col gap-2.5 flex-1">
                    {plan.features.map((f, fi) => (
                      <li
                        key={fi}
                        className="text-theme-body font-avenir text-[0.95rem] flex items-start gap-2.5"
                      >
                        <svg
                          className="w-4 h-4 mt-1 shrink-0"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs>
                            <linearGradient id={`check-${i}-${fi}`} x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
                              <stop offset="0" stopColor="var(--theme-accent-from)" />
                              <stop offset="1" stopColor="var(--theme-accent-to)" />
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
                      className={`btn w-full inline-flex items-center justify-center ${
                        plan.highlighted
                          ? "theme-cta-button"
                          : "bg-transparent text-theme-heading border border-theme-border hover:bg-white/5 hover:border-theme-heading/50"
                      }`}
                    >
                      {plan.ctaText || "Get Started"}
                    </a>
                  ) : (
                    <button
                      onClick={onScrollToEarlyAccess}
                      className={`btn w-full ${
                        plan.highlighted
                          ? "theme-cta-button"
                          : "bg-transparent text-theme-heading border border-theme-border hover:bg-white/5 hover:border-theme-heading/50"
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
