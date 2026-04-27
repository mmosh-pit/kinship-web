"use client";

import React from "react";
import { useRouter } from "next/navigation";
import KinshipBots from "../../../../public/assets/icons/KinshipBots";
import Button from "@/components/Button/Button";

export default function PageHeader() {
  const router = useRouter();

  return (
    <header className="w-full fixed flex justify-center z-10">
      <div className="flex justify-between items-center max-2xl:container px-4 max-xl:py-4 py-8 bg-[#32323212] backdrop-filter backdrop-blur-[13px] sm:rounded-full w-full 2xl:mx-40 self-center">
        <button onClick={() => router.push("/")}>
          <KinshipBots />
        </button>

        <div className="flex items-center gap-3 font-bold">
          <Button
            action={() => router.push("/")}
            size="small"
            isPrimary
            title="Home"
            isLoading={false}
          />
        </div>
      </div>
    </header>
  );
}
