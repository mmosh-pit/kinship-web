"use client";

import React from "react";
import { VideoSectionBlock } from "./blocks/VideoSectionBlock";
import { RichTextSectionBlock } from "./blocks/RichTextSectionBlock";
import { CardsGridBlock } from "./blocks/CardsGridBlock";
import { HomeHeroBlock } from "./blocks/HomeHeroBlock";

type BlockProps = {
  block: Record<string, any>;
  onScrollToEarlyAccess: () => void;
};

const blockComponents: Record<string, React.ComponentType<BlockProps>> = {
  videoSection: VideoSectionBlock,
  richTextSection: RichTextSectionBlock,
  cardsGrid: CardsGridBlock,
  homeHero: HomeHeroBlock,
};

export function BlockRenderer({ block, onScrollToEarlyAccess }: BlockProps) {
  const Component = blockComponents[block.blockType];
  if (!Component) return null;
  return <Component block={block} onScrollToEarlyAccess={onScrollToEarlyAccess} />;
}
