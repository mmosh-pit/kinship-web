"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { data as userAtom, isAuth as isAuthAtom } from "@/app/(main)/store";
import client from "@/app/(main)/lib/httpClient";
import styles from "./register.module.css";
import TierPicker from "./_components/TierPicker";
import RegisterHome from "./_components/RegisterHome";
import { isTierId, type Billing, type TierId } from "./tiers";

type CheckoutStatus = "success" | "canceled" | null;

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

function isUserSubscribed(
  user: {
    subscriptionTier?: string | null;
    subscriptionStatus?: string | null;
  } | null,
): boolean {
  if (!user) return false;
  return (
    !!user.subscriptionTier &&
    !!user.subscriptionStatus &&
    ACTIVE_STATUSES.has(user.subscriptionStatus)
  );
}

function RegisterFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useAtom(userAtom);
  const [, setIsAuthState] = useAtom(isAuthAtom);

  const rawTier = searchParams.get("tier");
  const rawBilling = searchParams.get("billing");
  const rawCheckout = searchParams.get("checkout");
  const tierFromUrl: TierId | null = isTierId(rawTier) ? rawTier : null;
  const billing: Billing = rawBilling === "yearly" ? "yearly" : "monthly";
  const checkout: CheckoutStatus =
    rawCheckout === "success" || rawCheckout === "canceled"
      ? rawCheckout
      : null;

  const [authChecked, setAuthChecked] = useState(false);
  const [pickError, setPickError] = useState<string | null>(null);
  const [pickingId, setPickingId] = useState<TierId | null>(null);
  const authCheckRan = useRef(false);

  // ── Guard 1: must be logged in.
  // Hit /is-auth on mount. If the call fails or returns no user, send them
  // to "/". If the call succeeds, hydrate the user atom.
  useEffect(() => {
    if (authCheckRan.current) return;
    authCheckRan.current = true;
    (async () => {
      try {
        const res = await client.get("/is-auth");
        const fresh = res.data?.data?.user;
        if (!fresh) {
          router.replace("/");
          return;
        }
        setUser(fresh);
        setIsAuthState(true);
        setAuthChecked(true);
      } catch {
        router.replace("/");
      }
    })();
  }, [router, setUser, setIsAuthState]);

  // ── After returning from Stripe Checkout, poll /is-auth a few times so the
  // webhook-updated subscription state propagates into the user atom.
  useEffect(() => {
    if (checkout !== "success") return;
    let cancelled = false;
    (async () => {
      for (let i = 0; i < 6; i++) {
        try {
          const res = await client.get("/is-auth");
          const fresh = res.data?.data?.user;
          if (!cancelled && fresh) {
            setUser(fresh);
            if (isUserSubscribed(fresh)) return;
          }
        } catch {
          // ignore — try again
        }
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 1500));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [checkout, setUser]);

  const handlePick = async (id: TierId, picked: Billing) => {
    setPickError(null);

    // Guest is free — persist the choice and land on the home view.
    if (id === "guest") {
      setPickingId(id);
      try {
        await client.post("/select-guest-tier");
        const res = await client.get("/is-auth");
        const fresh = res.data?.data?.user;
        if (fresh) setUser(fresh);
        const qs = new URLSearchParams({ tier: id, billing: picked });
        router.push(`/register?${qs.toString()}`);
      } catch {
        setPickError("Couldn’t save your choice. Please try again.");
        setPickingId(null);
      }
      return;
    }

    // Paid tiers go through Stripe Checkout.
    setPickingId(id);
    try {
      const res = await client.post("/stripe/checkout-session", {
        tier: id,
        billing: picked,
      });
      const url: string | undefined = res.data?.url;
      if (!url) throw new Error("missing-url");
      window.location.href = url;
    } catch (err: any) {
      const code = err?.response?.data?.error;
      setPickError(
        code === "price-not-configured"
          ? "This plan isn’t available yet. Try another one or come back later."
          : "Couldn’t start checkout. Please try again.",
      );
      setPickingId(null);
    }
  };

  const handleChangeTier = () => router.push("/register");
  const handleLogout = () => router.push("/login");

  // Show nothing while we verify auth — avoids flashing the picker before the
  // already-subscribed redirect kicks in.
  if (!authChecked) {
    return null;
  }

  // ── Guard 2: if the user already has a subscription on file, jump straight
  // to the home view using their persisted tier (URL params are advisory).
  const persistedTier: TierId | null = isTierId(user?.subscriptionTier)
    ? (user!.subscriptionTier as TierId)
    : null;

  if (persistedTier && isUserSubscribed(user)) {
    const persistedBilling: Billing =
      user?.subscriptionBilling === "yearly" ? "yearly" : "monthly";
    const firstName =
      user?.profile?.name ||
      user?.profile?.displayName ||
      (user?.name ? user.name.split(" ")[0] : undefined);
    return (
      <>
        <div className={styles.checkoutBanner} data-tone="info">
          You’re already in — welcome back. Manage your plan from Settings.
        </div>
        <RegisterHome
          tier={persistedTier}
          billing={persistedBilling}
          firstName={firstName}
          onChangeTier={handleChangeTier}
          onLogout={handleLogout}
        />
      </>
    );
  }

  // ── If a tier was supplied via URL (e.g. fresh ?checkout=success redirect
  // before the webhook lands) and the user is on it, show the home view.
  if (tierFromUrl && (tierFromUrl === "guest" || isUserSubscribed(user))) {
    const firstName =
      user?.profile?.name ||
      user?.profile?.displayName ||
      (user?.name ? user.name.split(" ")[0] : undefined);
    return (
      <RegisterHome
        tier={tierFromUrl}
        billing={billing}
        firstName={firstName}
        onChangeTier={handleChangeTier}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <>
      {checkout === "canceled" && (
        <div className={styles.checkoutBanner} data-tone="warning">
          Checkout was canceled. Pick a tier to try again.
        </div>
      )}
      {checkout === "success" && (
        <div className={styles.checkoutBanner} data-tone="info">
          Confirming your subscription… this can take a few seconds.
        </div>
      )}
      {pickError && (
        <div className={styles.checkoutBanner} data-tone="error">
          {pickError}
        </div>
      )}
      <TierPicker
        initialBilling={billing}
        onPick={handlePick}
        pickingId={pickingId}
      />
    </>
  );
}

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Suspense fallback={null}>
          <RegisterFlow />
        </Suspense>
      </div>
    </div>
  );
}
