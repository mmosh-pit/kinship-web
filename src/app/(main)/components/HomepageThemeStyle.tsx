type ThemeData = Record<string, any> | null | undefined;

const cssVarMap: Record<string, string> = {
  bgPage: "--theme-bg-page",
  bgCardFrom: "--theme-bg-card-from",
  bgCardTo: "--theme-bg-card-to",
  bgGlass: "--theme-bg-glass",
  textHeading: "--theme-text-heading",
  textBody: "--theme-text-body",
  textMuted: "--theme-text-muted",
  textFaint: "--theme-text-faint",
  textError: "--theme-text-error",
  borderCardFrom: "--theme-border-card-from",
  borderCardTo: "--theme-border-card-to",
  borderGlass: "--theme-border-glass",
  borderDivider: "--theme-border-divider",
  accentFrom: "--theme-accent-from",
  accentTo: "--theme-accent-to",
  ctaBg: "--theme-cta-bg",
  ctaText: "--theme-cta-text",
  headingGradFrom: "--theme-heading-gradient-from",
  headingGradTo: "--theme-heading-gradient-to",
};

export function HomepageThemeStyle({ theme }: { theme: ThemeData }) {
  if (!theme) return null;

  const declarations = Object.entries(cssVarMap)
    .map(([key, cssVar]) => {
      const value = theme[key];
      if (typeof value !== "string" || value.trim() === "") return null;
      // Strip backslashes/braces so a malformed value can't break out of the style tag
      const safe = value.replace(/[<>{}\\]/g, "").trim();
      return `${cssVar}: ${safe};`;
    })
    .filter(Boolean)
    .join(" ");

  if (!declarations) return null;

  return (
    <style
      // CSS injected from CMS theme global — only contains color/font values
      dangerouslySetInnerHTML={{ __html: `:root { ${declarations} }` }}
    />
  );
}
