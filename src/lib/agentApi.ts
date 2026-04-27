/**
 * Kinship Agent API Client
 *
 * Centralised axios instance that points every onboarding call at the
 * kinship-agent FastAPI server instead of the deprecated Next.js proxy.
 *
 * Usage:
 *   import { agentApi } from "@/lib/agentApi";
 *   const res = await agentApi.post("/visitors/generate-otp", { type: "email", email });
 *
 * Environment variable required:
 *   NEXT_PUBLIC_KINSHIP_AGENT_URL  –  e.g. "https://agent.kinshipbots.com"
 */

import axios from "axios";

if (!process.env.NEXT_PUBLIC_KINSHIP_AGENT_URL) {
  console.warn(
    "[agentApi] NEXT_PUBLIC_KINSHIP_AGENT_URL is not set. " +
      "Onboarding API calls will fail.",
  );
}

export const agentApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_KINSHIP_AGENT_URL ?? "",
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});
