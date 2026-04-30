"use client";

import { useState } from "react";
import { renderWithLineBreaks } from "../renderWithLineBreaks";

type Status = "idle" | "loading" | "success" | "error";

type Props = { block: Record<string, any> };

export function NewsletterBlock({ block }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const sectionId =
    block.sectionId ||
    (block.blockName ? block.blockName.toLowerCase().replace(/\s+/g, "-") : undefined);

  const placeholder = block.placeholder || "Your email address";
  const buttonText = block.buttonText || "Subscribe";
  const successMessage =
    block.successMessage || "Thanks — you're on the list.";
  const errorMessage =
    block.errorMessage || "Something went wrong. Please try again.";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    if (!block.endpoint) {
      setTimeout(() => setStatus("success"), 300);
      return;
    }

    try {
      const res = await fetch(block.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      id={sectionId}
      className="px-4 md:px-8 mt-[3rem] max-md:mt-8 scroll-mt-[120px]"
    >
      <div className="m-auto max-w-[85%] xl:w-[50rem] border border-theme-border bg-[rgba(0,0,0,0.05)] backdrop-blur-[19.5px] rounded-[3rem] xl:px-12 xl:py-12 p-6 text-center">
        {block.heading && (
          <h1 className="font-bold leading-tight text-[2.5rem] max-xl:text-4xl max-md:text-3xl max-sm:text-2xl font-goudy theme-heading-gradient stroke-text pb-[0.15em]">
            {renderWithLineBreaks(block.heading)}
          </h1>
        )}
        {block.description && (
          <p className="max-md:text-sm font-avenir text-center text-theme-body mt-3">
            {renderWithLineBreaks(block.description)}
          </p>
        )}

        {status === "success" ? (
          <div className="mt-6 inline-block theme-accent-gradient-soft-bg p-[1px] rounded-full">
            <p className="bg-theme-card-from text-theme-heading font-avenirNext font-bold text-base rounded-full px-6 py-3">
              {renderWithLineBreaks(successMessage)}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch max-w-[30rem] mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              disabled={status === "loading"}
              className="flex-1 rounded-full bg-[rgba(255,255,255,0.05)] backdrop-blur-[19.5px] text-theme-heading placeholder:text-theme-faint font-avenir px-5 py-3 border border-theme-border outline-none focus:border-theme-heading/50 transition disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn theme-cta-button px-8 disabled:opacity-60 rounded-full"
            >
              {status === "loading" ? "..." : buttonText}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-theme-error font-avenir text-sm">
            {renderWithLineBreaks(errorMessage)}
          </p>
        )}

        {block.privacyNote && status !== "success" && (
          <p className="mt-4 text-theme-faint font-avenir text-xs">
            {renderWithLineBreaks(block.privacyNote)}
          </p>
        )}
      </div>
    </div>
  );
}
