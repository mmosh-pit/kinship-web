"use client";

import { renderWithLineBreaks } from "../renderWithLineBreaks";

type Stat = { value?: string; label?: string; description?: string };

type Props = { block: Record<string, any> };

export function StatsBlock({ block }: Props) {
  const stats: Stat[] = block.stats || [];
  const sectionId =
    block.sectionId ||
    (block.blockName ? block.blockName.toLowerCase().replace(/\s+/g, "-") : undefined);

  const colsClass =
    stats.length >= 4
      ? "grid-cols-4 max-md:grid-cols-2"
      : stats.length === 3
      ? "grid-cols-3 max-md:grid-cols-1"
      : stats.length === 2
      ? "grid-cols-2 max-md:grid-cols-1"
      : "grid-cols-1";

  return (
    <div
      id={sectionId}
      className="px-4 md:px-8 mt-[3rem] max-md:mt-8 scroll-mt-[120px]"
    >
      {block.heading && (
        <h1 className="text-center font-bold xl:px-10 leading-tight xl:w-[65.063rem] text-[3.75rem] max-xl:text-5xl max-md:text-4xl max-sm:text-2xl m-auto font-goudy theme-heading-gradient stroke-text">
          {renderWithLineBreaks(block.heading)}
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
        {stats.map((s, i) => (
          <div
            key={i}
            className="theme-card-border p-[1px] rounded-xl"
          >
            <div className="theme-card-bg rounded-xl py-8 px-5 h-full flex flex-col items-center text-center">
              {s.value && (
                <p className="font-goudy font-bold text-[4rem] max-md:text-5xl leading-none theme-accent-gradient-text pb-[0.15em]">
                  {s.value}
                </p>
              )}
              {s.label && (
                <p className="text-theme-heading font-bold text-lg font-avenirNext mt-2">
                  {renderWithLineBreaks(s.label)}
                </p>
              )}
              {s.description && (
                <p className="text-theme-muted font-avenir text-sm leading-relaxed mt-2">
                  {renderWithLineBreaks(s.description)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
