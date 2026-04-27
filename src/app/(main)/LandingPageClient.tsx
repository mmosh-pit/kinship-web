"use client";

import React from "react";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Step1 } from "@/components/EarlyAccess/Step1/Step1";
import { Step2 } from "@/components/EarlyAccess/Step2/Step2";
import { Step3 } from "@/components/EarlyAccess/Step3/Step3";
import { Step4 } from "@/components/EarlyAccess/Step4/Step4";
import { Step5 } from "@/components/EarlyAccess/Step5/Step5";
import { Step6 } from "@/components/EarlyAccess/Step6/Step6";
import { testimonials } from "@/constants/testimonials";
import LandingPageDrawer from "@/components/LandingPageDrawer/LandingPageDrawer";
import { ErrorContainerVW } from "@/components/ErrorContainer/ErrorContainerVW";
import Button from "@/components/Button/Button";
import KinshipBots from "../../../public/assets/icons/KinshipBots";
import { BlockRenderer } from "./components/BlockRenderer";
import type { NavItem } from "./page";

const STORAGE_KEY = "early-access-data";

type CMSBlock = Record<string, any> & { blockType: string; blockName?: string };

export default function LandingPage({
  layout = [],
  navItems = [],
}: {
  layout?: CMSBlock[];
  navItems?: NavItem[];
}) {
  const searchParams = useSearchParams();

  const earlyAccessRef = useRef<HTMLDivElement>(null);
  const mainSection = useRef<HTMLDivElement>(null);
  const testimonialsSection = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 3;

  const totalSlides = Math.ceil((testimonials?.length || 0) / itemsPerSlide);

  const [currentStep, setCurrentStep] = useState<number>(1);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentStep(Number(parsed.currentStep) || 1);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setCurrentStep(1);
    }
  }, []);

  const prevSlide = () => {
    if (!totalSlides) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    if (!totalSlides) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const visibleTestimonials = (testimonials ?? []).slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide,
  );

  const scrollWithOffset = (
    ref: React.RefObject<HTMLElement | null>,
    offset = 120,
  ) => {
    if (!ref.current) return;
    const elementTop =
      ref.current.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: elementTop - offset, behavior: "smooth" });
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementTop - 120, behavior: "smooth" });
    }
  };

  React.useEffect(() => {
    const menuType = searchParams.get("menu_type");
    if (menuType === "join_early_access") {
      scrollWithOffset(earlyAccessRef);
    } else if (menuType) {
      scrollToId(menuType.replace(/_/g, "-"));
    }
  }, []);

  const [showMsg, setShowMsg] = React.useState(true);
  const [msgClass, setMsgClass] = React.useState("success");
  const [msgText, setMsgText] = React.useState("");

  return (
    <div className="relative h-full">
      <header className="w-full fixed flex justify-center z-10">
        <div className="flex justify-between items-center max-2xl:container px-4 max-xl:py-4 py-8 bg-[#32323212] backdrop-filter backdrop-blur-[13px] sm:rounded-full w-full 2xl:mx-40 self-center">
          <button
            className="hidden xl:block"
            onClick={() =>
              mainSection.current?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <KinshipBots />
          </button>

          <div className="flex xl:hidden flex-col items-center justify-center">
            <LandingPageDrawer scrollToId={scrollToId} navItems={navItems} />
          </div>
          <div className="hidden xl:flex justify-center items-center rounded-full border-[#FFFFFF47] border-[1px] bg-[#FFFFFF0F] px-4 py-2">
            {navItems.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="xl:mx-4 md:mx-2" />}
                <a
                  className="text-base text-white cursor-pointer"
                  onClick={() =>
                    item.actionType === "scroll"
                      ? scrollToId(item.sectionId ?? "")
                      : window.open(item.url ?? "/", "_blank")
                  }
                >
                  {item.label}
                </a>
              </React.Fragment>
            ))}
          </div>

          <div className="font-bold">
            <Button
              action={() => scrollWithOffset(earlyAccessRef)}
              size="small"
              isPrimary
              title="Join Early Access"
              isLoading={false}
            />
          </div>
        </div>
        <ErrorContainerVW
          showMessage={showMsg}
          className={msgClass}
          messageText={msgText}
        />
      </header>

      <div
        className="bg-[#050824] text-white min-h-screen mx-auto overflow-hidden top-0 w-full"
        ref={mainSection}
      >
        {/* ── CMS Blocks ── */}
        {layout.map((block, i) => (
          <BlockRenderer
            key={block.id || i}
            block={block}
            onScrollToEarlyAccess={() => scrollWithOffset(earlyAccessRef)}
          />
        ))}

        {/* ── Early Access Steps ── */}
        {currentStep === 1 && (
          <Step1
            onSuccess={() => setCurrentStep(2)}
            earlyAccessRef={earlyAccessRef}
            setShowMsg={setShowMsg}
            setMsgClass={setMsgClass}
            setMsgText={setMsgText}
          />
        )}
        {currentStep === 2 && (
          <Step2
            onSuccess={() => setCurrentStep(3)}
            earlyAccessRef={earlyAccessRef}
            onBack={() => setCurrentStep(1)}
            setShowMsg={setShowMsg}
            setMsgClass={setMsgClass}
            setMsgText={setMsgText}
          />
        )}
        {currentStep === 3 && (
          <Step3
            onSuccess={() => setCurrentStep(4)}
            earlyAccessRef={earlyAccessRef}
            onBack={() => setCurrentStep(1)}
            setShowMsg={setShowMsg}
            setMsgClass={setMsgClass}
            setMsgText={setMsgText}
          />
        )}
        {currentStep === 4 && (
          <Step4
            onSuccess={() => setCurrentStep(5)}
            earlyAccessRef={earlyAccessRef}
            onBack={() => setCurrentStep(3)}
            setShowMsg={setShowMsg}
            setMsgClass={setMsgClass}
            setMsgText={setMsgText}
          />
        )}
        {currentStep === 5 && (
          <Step5
            onSuccess={() => setCurrentStep(6)}
            earlyAccessRef={earlyAccessRef}
            onBack={() => setCurrentStep(4)}
            setShowMsg={setShowMsg}
            setMsgClass={setMsgClass}
            setMsgText={setMsgText}
          />
        )}
        {currentStep === 6 && (
          <Step6
            onBack={() => setCurrentStep(5)}
            earlyAccessRef={earlyAccessRef}
            setShowMsg={setShowMsg}
            setMsgClass={setMsgClass}
            setMsgText={setMsgText}
          />
        )}

        {/* ── Testimonials ── */}
        <section
          className="px-4 max-md:my-6 my-10 mx-auto"
          ref={testimonialsSection}
        >
          <div className="w-full px-4">
            <div className="relative max-w-[80rem] mx-auto">
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-[-2%] 2xl:left-[-5%] transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-[-2%] 2xl:right-[-5%] transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                {visibleTestimonials.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] text-white rounded-xl p-6 shadow-xl text-center border border-[#FFFFFF42]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="mx-auto mb-4 w-16 h-16 rounded-full object-cover border-2 border-white"
                    />
                    <p className="text-base italic mb-4 font-avenir">
                      &quot;{item.text}&quot;
                    </p>
                    <h3 className="font-extrabold text-lg font-avenirLtStd">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-300 font-avenirLtStd">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}