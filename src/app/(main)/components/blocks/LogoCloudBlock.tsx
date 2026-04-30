"use client";

import { renderWithLineBreaks } from "../renderWithLineBreaks";

type Logo = {
  image?: any;
  imageUrl?: string;
  alt?: string;
  linkUrl?: string;
};

type Props = { block: Record<string, any> };

export function LogoCloudBlock({ block }: Props) {
  const logos: Logo[] = block.logos || [];
  const sectionId =
    block.sectionId ||
    (block.blockName ? block.blockName.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div
      id={sectionId}
      className="px-4 md:px-8 mt-[3rem] max-md:mt-8 scroll-mt-[120px]"
    >
      {block.heading && (
        <p className="text-center text-theme-body font-avenirNext text-sm uppercase tracking-[0.25em] font-bold">
          {renderWithLineBreaks(block.heading)}
        </p>
      )}
      {block.subheading && (
        <p className="max-md:text-sm font-avenir text-center text-theme-body mt-[0.5rem] xl:w-[64.313rem] mx-auto">
          {renderWithLineBreaks(block.subheading)}
        </p>
      )}

      <div className="container mx-auto mt-8 px-3 xl:max-w-[79.5rem]">
        <div className="theme-card-border p-[1px] rounded-2xl">
          <div className="theme-card-bg rounded-2xl py-10 px-8 max-md:py-6 max-md:px-4 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 max-md:gap-x-6 max-md:gap-y-6">
            {logos.map((logo, i) => {
              const src =
                (typeof logo.image === "object" ? logo.image?.url : logo.image) ||
                logo.imageUrl;
              if (!src) return null;
              const imgEl = (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={logo.alt || ""}
                  className="h-10 max-md:h-8 w-auto object-contain opacity-60 hover:opacity-100 transition duration-300"
                />
              );
              return (
                <div key={i} className="flex items-center">
                  {logo.linkUrl ? (
                    <a
                      href={logo.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {imgEl}
                    </a>
                  ) : (
                    imgEl
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
