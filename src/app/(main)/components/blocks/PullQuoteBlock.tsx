"use client";

import { RichText } from "@payloadcms/richtext-lexical/react";

type Props = {
  block: Record<string, any>;
  onScrollToEarlyAccess: () => void;
};

const alignClass: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function PullQuoteBlock({ block }: Props) {
  const alignment = alignClass[block.alignment] ?? alignClass.center;

  return (
    <section
      id={block.sectionId || undefined}
      className={`max-w-[38rem] mx-auto px-6 py-16 max-md:py-10 scroll-mt-[120px] ${alignment}`}
    >
      <blockquote className="text-[1.75rem] max-md:text-xl leading-[1.45] font-normal text-white" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {block.quote && <RichText data={block.quote} />}
      </blockquote>

      {(block.attribution || block.attributionRole) && (
        <p className="mt-6 text-base font-avenir tracking-wide text-[rgba(255,255,255,0.6)]">
          {[block.attribution, block.attributionRole]
            .filter(Boolean)
            .join(", ")}
        </p>
      )}
    </section>
  );
}
