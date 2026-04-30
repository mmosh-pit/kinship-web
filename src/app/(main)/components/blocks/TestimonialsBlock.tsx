"use client";

import { renderWithLineBreaks } from "../renderWithLineBreaks";

type Testimonial = {
  quote?: string;
  authorName?: string;
  authorTitle?: string;
  company?: string;
  avatar?: any;
  avatarUrl?: string;
};

type Props = { block: Record<string, any> };

export function TestimonialsBlock({ block }: Props) {
  const testimonials: Testimonial[] = block.testimonials || [];
  const sectionId =
    block.sectionId ||
    (block.blockName ? block.blockName.toLowerCase().replace(/\s+/g, "-") : undefined);

  const colsClass =
    testimonials.length >= 3
      ? "grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1"
      : testimonials.length === 2
      ? "grid-cols-2 max-md:grid-cols-1"
      : "grid-cols-1 max-w-[50rem] mx-auto";

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
        {testimonials.map((t, i) => {
          const avatarSrc =
            (typeof t.avatar === "object" ? t.avatar?.url : t.avatar) ||
            t.avatarUrl;
          const meta = [t.authorTitle, t.company].filter(Boolean).join(" · ");
          return (
            <div
              key={i}
              className="theme-card-border p-[1px] rounded-xl"
            >
              <div className="theme-card-bg rounded-xl py-8 px-6 h-full flex flex-col relative">
                <span
                  aria-hidden
                  className="font-goudy text-[5rem] leading-none theme-accent-gradient-text select-none -mt-2 mb-2"
                >
                  &ldquo;
                </span>
                {t.quote && (
                  <p className="text-theme-heading font-avenir text-[1.063rem] leading-relaxed flex-1">
                    {renderWithLineBreaks(t.quote)}
                  </p>
                )}
                {(avatarSrc || t.authorName || meta) && (
                  <div className="flex items-center mt-6 gap-3 pt-6 border-t border-theme-divider">
                    {avatarSrc && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarSrc}
                        alt={t.authorName || ""}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border border-theme-border"
                      />
                    )}
                    <div className="flex flex-col">
                      {t.authorName && (
                        <p className="text-theme-heading font-bold text-base font-avenirNext leading-tight">
                          {t.authorName}
                        </p>
                      )}
                      {meta && (
                        <p className="text-theme-muted font-avenir text-sm mt-0.5">
                          {meta}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
