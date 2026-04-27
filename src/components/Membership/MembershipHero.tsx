"use client";

import React from "react";

interface MembershipHeroProps {
  firstName?: string;
}

export const MembershipHero: React.FC<MembershipHeroProps> = ({ firstName }) => {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
      <h1 className="font-poppinsNew text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-[#FFFFFF88] bg-clip-text text-transparent mb-4">
        {firstName ? `Welcome to Kinship, ${firstName}` : "Choose Your Membership"}
      </h1>
      <p className="text-base text-[#FFFFFFCC] font-avenir leading-relaxed max-w-lg mx-auto">
        Choose the membership that fits where you are right now.
        You can always upgrade later.
      </p>
    </div>
  );
};
