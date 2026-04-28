"use client";

import React from "react";
import { HeroBlock } from "./blocks/HeroBlock";
import { VideoSectionBlock } from "./blocks/VideoSectionBlock";
import { RichTextSectionBlock } from "./blocks/RichTextSectionBlock";
import { CardsGridBlock } from "./blocks/CardsGridBlock";
import { FeaturesGridBlock } from "./blocks/FeaturesGridBlock";
import { TestimonialsBlock } from "./blocks/TestimonialsBlock";
import { LogoCloudBlock } from "./blocks/LogoCloudBlock";
import { StatsBlock } from "./blocks/StatsBlock";
import { CtaSectionBlock } from "./blocks/CtaSectionBlock";
import { FaqBlock } from "./blocks/FaqBlock";
import { PricingBlock } from "./blocks/PricingBlock";
import { StepsBlock } from "./blocks/StepsBlock";
import { MediaContentBlock } from "./blocks/MediaContentBlock";
import { NewsletterBlock } from "./blocks/NewsletterBlock";

type BlockProps = {
  block: Record<string, any>;
  onScrollToEarlyAccess: () => void;
};

const blockComponents: Record<string, React.ComponentType<BlockProps>> = {
  hero: HeroBlock,
  videoSection: VideoSectionBlock,
  richTextSection: RichTextSectionBlock,
  cardsGrid: CardsGridBlock,
  featuresGrid: FeaturesGridBlock,
  testimonials: TestimonialsBlock,
  logoCloud: LogoCloudBlock,
  statsNumbers: StatsBlock,
  ctaSection: CtaSectionBlock,
  faq: FaqBlock,
  pricingTable: PricingBlock,
  steps: StepsBlock,
  mediaContent: MediaContentBlock,
  newsletter: NewsletterBlock,
};

export function BlockRenderer({ block, onScrollToEarlyAccess }: BlockProps) {
  const Component = blockComponents[block.blockType];
  if (!Component) return null;
  console.log("BLOCK:", block);
  return <Component block={block} onScrollToEarlyAccess={onScrollToEarlyAccess} />;
}
