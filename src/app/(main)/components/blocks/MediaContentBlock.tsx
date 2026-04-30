"use client";

import { renderWithLineBreaks } from "../renderWithLineBreaks";

type Props = {
  block: Record<string, any>;
  onScrollToEarlyAccess: () => void;
};

export function MediaContentBlock({ block, onScrollToEarlyAccess }: Props) {
  const sectionId =
    block.sectionId ||
    (block.blockName ? block.blockName.toLowerCase().replace(/\s+/g, "-") : undefined);

  const imageUrl =
    (typeof block.image === "object" ? block.image?.url : block.image) ||
    block.imageUrl ||
    null;

  const imagePosition: "left" | "right" = block.imagePosition || "left";

  const paragraphs = (block.body || "")
    .split("\n\n")
    .map((p: string) => p.trim())
    .filter(Boolean);

  const imageEl = imageUrl ? (
    <div
      className="w-full h-[350px] xl:w-[433px] xl:h-[430px] shrink-0 rounded-[30px] bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${imageUrl})` }}
    />
  ) : null;

  const contentEl = (
    <div className="flex flex-col px-4 xl:w-[695px] gap-4 mt-4 xl:mt-0">
      {block.heading && (
        <h3 className="font-goudy font-bold md:text-[3.125rem] max-md:text-2xl leading-[1.1] tracking-[-1.04px] theme-heading-gradient stroke-text pb-[0.15em]">
          {renderWithLineBreaks(block.heading)}
        </h3>
      )}
      {block.subheading && (
        <p className="max-sm:text-lg text-xl leading-[120%] tracking-[-0.02em] font-bold text-theme-body font-avenirNext">
          {renderWithLineBreaks(block.subheading)}
        </p>
      )}
      {paragraphs.map((para: string, i: number) => (
        <p
          key={i}
          className="font-avenir text-base sm:text-[1.063rem] max-md:leading-relaxed font-normal leading-[130%] tracking-[-0.02em] text-theme-body"
        >
          {renderWithLineBreaks(para)}
        </p>
      ))}
      {block.ctaText && (
        <div className="mt-2">
          {block.ctaUrl ? (
            <a
              href={block.ctaUrl}
              className="btn theme-cta-button inline-flex items-center justify-center px-8"
            >
              {block.ctaText}
            </a>
          ) : (
            <button
              onClick={onScrollToEarlyAccess}
              className="btn theme-cta-button px-8"
            >
              {block.ctaText}
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <section
      id={sectionId}
      className="max-md:pt-7 max-md:pb-0 pb-16 max-w-[1144px] mx-auto px-4 md:px-8 scroll-mt-[120px]"
    >
      <div
        className={`xl:flex items-center mt-5 gap-4 ${
          imagePosition === "right" ? "xl:flex-row-reverse" : ""
        }`}
      >
        {imageEl}
        {contentEl}
      </div>
    </section>
  );
}
