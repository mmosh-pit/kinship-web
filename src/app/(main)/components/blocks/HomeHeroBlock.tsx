"use client";

type Props = {
  block: Record<string, any>;
  onScrollToEarlyAccess: () => void;
};

export function HomeHeroBlock({ block }: Props) {
  const sectionId =
    block.sectionId ||
    (block.blockName
      ? block.blockName.toLowerCase().replace(/\s+/g, "-")
      : undefined);

  return (
    <section
      id={sectionId}
      className="bg-white px-6 py-24 md:py-32 lg:py-40 scroll-mt-[120px]"
      style={{ fontFamily: "Georgia, serif" }}
    >
      <div className="mx-auto max-w-[65ch]">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-black">
          {block.headline}
        </h1>

        {block.subhead && (
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-gray-800">
            {block.subhead}
          </p>
        )}

        {block.bodyParagraphOne && (
          <p className="mt-10 text-base md:text-lg leading-relaxed text-gray-900">
            {block.bodyParagraphOne}
          </p>
        )}

        {block.bodyParagraphTwo && (
          <p className="mt-6 text-base md:text-lg leading-relaxed text-gray-900">
            {block.bodyParagraphTwo}
          </p>
        )}

        <div className="mt-10">
          <a
            href={block.ctaHref || "/early-access"}
            className="inline-block bg-black text-white px-8 py-4 text-base md:text-lg font-bold no-underline hover:bg-gray-900 transition-colors"
          >
            {block.ctaLabel || "Get Early Access"}
          </a>
        </div>

        {block.subCtaText && (
          <p className="mt-4 text-sm md:text-base text-gray-500">
            {block.subCtaText}
          </p>
        )}
      </div>
    </section>
  );
}
