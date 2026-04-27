import { atom } from "jotai";
import { User } from "@/models/user";

export enum UserStatus {
  noTelegram,
  noAccount,
  noTwitter,
  noProfile,
  fullAccount,
}

export const status = atom<UserStatus>(UserStatus.noTelegram);

export const data = atom<User | null>(null);

export const isDrawerOpen = atom(false);

export const lineage = atom([
  { label: "Promoted", value: "gen1", selected: true, subLabel: "Gen 1" },
  { label: "Scouted", value: "gen2", selected: true, subLabel: "Gen 2" },
  { label: "Recruited", value: "gen3", selected: true, subLabel: "Gen 3" },
  { label: "Originated", value: "gen4", selected: true, subLabel: "Gen 4" },
]);

export const settings = atom(false);
