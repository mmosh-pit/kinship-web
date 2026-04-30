"use client";

import { renderWithLineBreaks } from "../renderWithLineBreaks";

type FaqItem = { question?: string; answer?: string };

type Props = { block: Record<string, any> };

export function FaqBlock({ block }: Props) {
  const items: FaqItem[] = block.items || [];
  const sectionId =
    block.sectionId ||
    (block.blockName ? block.blockName.toLowerCase().replace(/\s+/g, "-") : undefined);

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

      <div className="container mx-auto flex flex-col gap-3 px-3 max-xl:mt-5 xl:mt-10 mb-4 max-w-[50rem]">
        {items.map((item, i) => (
          <details
            key={i}
            className="group theme-card-border p-[1px] rounded-xl"
          >
            <summary className="list-none cursor-pointer theme-card-bg rounded-xl px-6 py-5 flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden hover:brightness-110 transition-all">
              <span className="text-theme-heading font-bold text-lg font-avenirNext text-left flex-1">
                {item.question && renderWithLineBreaks(item.question)}
              </span>
              <span className="shrink-0 w-7 h-7 rounded-full theme-accent-gradient-soft-bg flex items-center justify-center transition-transform duration-300 group-open:rotate-180">
                <svg
                  className="w-3.5 h-3.5 text-theme-heading"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 5L7 9L11 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </summary>
            {item.answer && (
              <div className="px-6 pb-6 pt-1 text-theme-muted font-avenir text-[1rem] leading-relaxed">
                {renderWithLineBreaks(item.answer)}
              </div>
            )}
          </details>
        ))}
      </div>
    </div>
  );
}
