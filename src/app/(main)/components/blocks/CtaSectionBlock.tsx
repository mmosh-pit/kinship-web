"use client";

import { renderWithLineBreaks } from "../renderWithLineBreaks";

type Props = {
  block: Record<string, any>;
  onScrollToEarlyAccess: () => void;
};

export function CtaSectionBlock({ block, onScrollToEarlyAccess }: Props) {
  const sectionId =
    block.sectionId ||
    (block.blockName ? block.blockName.toLowerCase().replace(/\s+/g, "-") : undefined);

  const bgImage =
    typeof block.backgroundImage === "object"
      ? block.backgroundImage?.url
      : block.backgroundImage;

  const ctaText = block.ctaText || "Join Early Access";

  const buttonEl = block.ctaUrl ? (
    <a
      href={block.ctaUrl}
      className="btn theme-cta-button min-w-[15rem] inline-flex items-center justify-center"
    >
      {ctaText}
    </a>
  ) : (
    <button
      className="btn theme-cta-button min-w-[15rem]"
      onClick={onScrollToEarlyAccess}
    >
      {ctaText}
    </button>
  );

  return (
    <div
      id={sectionId}
      className="px-4 md:px-8 mt-[3rem] max-md:mt-8 scroll-mt-[120px]"
    >
      <div
        className={`relative m-auto max-w-[85%] xl:w-[64.313rem] border-[0.031rem] border-theme-border ${
          bgImage ? "bg-cover bg-center" : "theme-glass-bg"
        } md:backdrop-filter backdrop-blur-[30px] rounded-[3rem] xl:px-12 xl:py-14 p-6 text-center`}
        style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
      >
        {block.heading && (
          <h1 className="font-bold leading-tight text-[3rem] max-xl:text-4xl max-md:text-3xl max-sm:text-2xl font-goudy theme-heading-gradient stroke-text pb-[0.15em]">
            {renderWithLineBreaks(block.heading)}
          </h1>
        )}
        {block.description && (
          <p className="max-md:text-sm font-avenir text-center text-theme-body mt-4 xl:px-12">
            {renderWithLineBreaks(block.description)}
          </p>
        )}
        <div className="mt-6 flex justify-center">{buttonEl}</div>
      </div>
    </div>
  );
}
