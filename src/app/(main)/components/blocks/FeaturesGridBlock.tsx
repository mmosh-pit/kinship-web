"use client";

import { renderWithLineBreaks } from "../renderWithLineBreaks";

type Feature = {
  icon?: any;
  iconUrl?: string;
  title?: string;
  description?: string;
};

type Props = { block: Record<string, any> };

export function FeaturesGridBlock({ block }: Props) {
  const features: Feature[] = block.features || [];
  const sectionId =
    block.sectionId ||
    (block.blockName ? block.blockName.toLowerCase().replace(/\s+/g, "-") : undefined);

  const colsClass =
    features.length >= 4
      ? "grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1"
      : "grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1";

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
        className={`container mx-auto grid ${colsClass} gap-5 px-3 max-xl:mt-5 xl:mt-10 mb-4 xl:max-w-[79.5rem]`}
      >
        {features.map((f, i) => {
          const iconSrc =
            (typeof f.icon === "object" ? f.icon?.url : f.icon) || f.iconUrl;
          return (
            <div
              key={i}
              className="theme-card-border p-[1px] rounded-xl"
            >
              <div className="theme-card-bg rounded-xl py-7 px-5 h-full flex flex-col items-center text-center">
                {iconSrc && (
                  <div className="theme-accent-gradient-soft-bg p-[1px] rounded-2xl mb-4">
                    <div className="bg-theme-card-from rounded-2xl w-14 h-14 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={iconSrc}
                        alt={f.title || ""}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </div>
                )}
                {f.title && (
                  <p className="text-theme-heading font-bold text-[1.375rem] font-avenirNext">
                    {renderWithLineBreaks(f.title)}
                  </p>
                )}
                {f.description && (
                  <p className="text-theme-muted font-avenir text-[0.938rem] leading-[140%] tracking-[-0.02em] mt-2">
                    {renderWithLineBreaks(f.description)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
