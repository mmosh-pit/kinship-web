"use client";

import { renderWithLineBreaks } from "../renderWithLineBreaks";

type Step = {
  title?: string;
  description?: string;
  icon?: any;
  iconUrl?: string;
};

type Props = { block: Record<string, any> };

function StepNumber({ n }: { n: number }) {
  return (
    <div className="bg-[linear-gradient(96.69deg,#ff29c3_0%,#0765ff_100%)] p-[1.5px] rounded-full shrink-0">
      <div className="w-12 h-12 rounded-full bg-[#070a38] flex items-center justify-center">
        <span className="font-goudy font-bold text-xl bg-[linear-gradient(96.69deg,#ff29c3_0%,#0765ff_100%)] bg-clip-text text-transparent leading-none pb-[0.05em]">
          {n}
        </span>
      </div>
    </div>
  );
}

export function StepsBlock({ block }: Props) {
  const steps: Step[] = block.steps || [];
  const layout: "horizontal" | "vertical" = block.layout || "horizontal";
  const sectionId =
    block.sectionId ||
    (block.blockName ? block.blockName.toLowerCase().replace(/\s+/g, "-") : undefined);

  const horizontalColsClass =
    steps.length >= 4
      ? "grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1"
      : steps.length === 3
      ? "grid-cols-3 max-md:grid-cols-1"
      : steps.length === 2
      ? "grid-cols-2 max-md:grid-cols-1"
      : "grid-cols-1";

  return (
    <div
      id={sectionId}
      className="px-4 md:px-8 mt-[3rem] max-md:mt-8 scroll-mt-[120px]"
    >
      {block.sectionTitle && (
        <h1 className="text-center font-bold xl:px-10 leading-tight xl:w-[65.063rem] text-[3.75rem] max-xl:text-5xl max-md:text-4xl max-sm:text-2xl m-auto font-goudy bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text pb-[0.15em]">
          {renderWithLineBreaks(block.sectionTitle)}
        </h1>
      )}

      {block.description && (
        <p className="max-md:text-sm font-avenir text-center text-[#FFFFFFC7] mt-[1rem] xl:w-[64.313rem] mx-auto">
          {renderWithLineBreaks(block.description)}
        </p>
      )}

      {layout === "horizontal" ? (
        <div
          className={`container mx-auto grid ${horizontalColsClass} gap-5 px-3 max-xl:mt-5 xl:mt-10 mb-4 xl:max-w-[79.5rem]`}
        >
          {steps.map((step, i) => {
            const iconSrc =
              (typeof step.icon === "object" ? step.icon?.url : step.icon) ||
              step.iconUrl;
            return (
              <div
                key={i}
                className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] rounded-xl"
              >
                <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl py-7 px-5 h-full flex flex-col items-center text-center">
                  <StepNumber n={i + 1} />
                  {iconSrc && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={iconSrc}
                      alt={step.title || ""}
                      className="w-12 h-12 object-contain mt-4"
                    />
                  )}
                  {step.title && (
                    <p className="text-white font-bold text-[1.25rem] font-avenirNext mt-4">
                      {renderWithLineBreaks(step.title)}
                    </p>
                  )}
                  {step.description && (
                    <p className="text-[#CDCDCDE5] font-avenir text-[0.938rem] leading-[140%] tracking-[-0.02em] mt-2">
                      {renderWithLineBreaks(step.description)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="container mx-auto flex flex-col gap-6 px-3 max-xl:mt-5 xl:mt-10 mb-4 max-w-[50rem]">
          {steps.map((step, i) => {
            const iconSrc =
              (typeof step.icon === "object" ? step.icon?.url : step.icon) ||
              step.iconUrl;
            return (
              <div key={i} className="flex items-start gap-5">
                <StepNumber n={i + 1} />
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3">
                    {iconSrc && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={iconSrc}
                        alt={step.title || ""}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    {step.title && (
                      <p className="text-white font-bold text-[1.25rem] font-avenirNext">
                        {renderWithLineBreaks(step.title)}
                      </p>
                    )}
                  </div>
                  {step.description && (
                    <p className="text-[#CDCDCDE5] font-avenir text-[0.938rem] leading-relaxed mt-2">
                      {renderWithLineBreaks(step.description)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
