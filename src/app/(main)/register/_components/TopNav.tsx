"use client";

import styles from "../register.module.css";
import KinshipBots from "@/assets/icons/KinshipBots";
import Button from "../../components/common/Button";
import { TIERS, type TierId } from "../tiers";

export type TopNavProps = {
  step: "picker" | "home";
  tier?: TierId;
  onChangeTier?: () => void;
  onLogout?: () => void;
};

export function TopNav({ step, tier, onChangeTier, onLogout }: TopNavProps) {
  const tierObj = tier ? TIERS[tier] : null;
  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <KinshipBots />
        {step === "home" && tierObj && (
          <span
            className={styles.tierPill}
            style={{
              color: tierObj.accent,
              background: tierObj.accentSoft,
              borderColor: tierObj.accentBorder,
            }}
          >
            {tierObj.name}
          </span>
        )}
      </div>
      <div className={styles.navLinks}>
        {step === "home" && (
          <Button 
            action={onChangeTier}
            size="small"
            isPrimary={false}
            title="Settings"
            isLoading={false}
          />
        )}
        <Button
          action={onLogout}
          size="small"
          isPrimary
          title="Logout"
          isLoading={false}
        />
      </div>
    </nav>
  );
}
