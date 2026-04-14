import { getPayload } from "payload";
import config from "@payload-config";
import LandingPage from "./LandingPageClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const payload = await getPayload({ config });

  let layout: Record<string, any>[] = [];

  try {
    const homepage = await payload.findGlobal({
      slug: "homepage",
      overrideAccess: true,
      depth: 2,
    });
    layout = (homepage?.layout as any[]) ?? [];
  } catch {
    // DB not yet migrated or global empty — fall through to hardcoded defaults
  }

  return <LandingPage layout={layout} />;
}
