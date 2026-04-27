"use client";
import React, { useState } from "react";
import { BackArrowVW } from "@/components/BackArrow/BackArrowVW";
import { EarlyAccessCircleVW } from "@/components/EarlyAccessCircle/EarlyAccessCircleVW";
import { InputVW } from "@/components/Input/InputVW";
import Spinner from "@/components/Spinner/Spinner";
import { agentApi } from "@/lib/agentApi";
import { useRouter } from "next/navigation";

interface Step6Props {
  onBack?: () => void;
  earlyAccessRef: any;
  setShowMsg: (data: any) => void;
  setMsgText: (data: any) => void;
  setMsgClass: (data: any) => void;
}

export const Step6 = ({
  onBack,
  setShowMsg,
  setMsgText,
  setMsgClass,
  earlyAccessRef,
}: Step6Props) => {
  const router = useRouter();

  const [cachedData, setCachedData] = React.useState<any>({});
  const msgTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [noCodeChecked, setNoCodeChecked] = React.useState(false);
  const [kinshipCode, setKinshipCode] = React.useState("");

  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("early-access-data");
    if (!stored) {
      return router.replace("/home_test");
    }
    try {
      const result = JSON.parse(stored);
      setCachedData(result);
      if (result?.completedSteps !== undefined && result?.completedSteps < 24) {
        router.replace(`/${result.currentStep}`);
      }
      setKinshipCode(result.referedKinshipCode);
      setNoCodeChecked(result.noCodeChecked);
    } catch {
      router.replace("/home_test");
    }
  }, []);

  /**
   * Calls the save-early-access endpoint with all collected onboarding data,
   * stores the returned JWT and user object, then redirects to /join.
   */
  const saveEarlyAccess = async (
    data: any,
    refCode: string,
    noCode: boolean,
  ) => {
    const payload = {
      fullName: data.firstName,
      email: data.email,
      password: data.password,
      currentStep: "complete",
      hasChecked: data.hasChecked ?? false,
      hasVerifiedEmail: data.hasVerifiedEmail ?? false,
      isMobileNumberVerified: data.isMobileNumberVerified ?? false,
      mobileNumber: data.mobileNumber || null,
      countryCode: data.countryCode || null,
      country: data.country || null,
      mobilePreferences: data.mobilePreferences || [],
      referedKinshipCode: refCode,
      noCodeChecked: noCode,
      about: "",
    };

    const res = await agentApi.post("/visitors/save-early-access", payload);

    if (!res.data?.status) {
      createMessage(
        res.data?.message || "Unable to save information",
        "error",
      );
      return false;
    }

    localStorage.removeItem("early-access-data");

    // Store auth token and user data from kinship-agent
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }
    if (res.data?.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    createMessage("Successfully submitted.", "success");
    router.replace("/membership");
    return true;
  };

  const submitKinshipCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!kinshipCode && !noCodeChecked) {
      createMessage(
        "Please enter a Kinship Code or confirm that you don't have code.",
        "error"
      );
      return;
    }

    if (noCodeChecked && !kinshipCode) {
      setIsLoading(true);

      // Persist mobile-verification data to kinship-agent (non-blocking)
      agentApi
        .post("/visitors/upsert-early-access", {
          email: cachedData.email,
          isMobileNumberVerified: true,
          mobileNumber: cachedData.mobileNumber,
          countryCode: cachedData.countryCode,
          country: cachedData.country,
          currentStep: "step6",
        })
        .catch(() => {});

      try {
        await saveEarlyAccess(cachedData, "", true);
      } catch {
        createMessage("Something went wrong", "error");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (kinshipCode.length < 6) {
      createMessage(
        "Kinship Code must be between 6 and 16 characters.",
        "error"
      );
      return;
    }

    try {
      setIsLoading(true);

      // Persist mobile-verification data to kinship-agent (non-blocking)
      agentApi
        .post("/visitors/upsert-early-access", {
          email: cachedData.email,
          isMobileNumberVerified: true,
          mobileNumber: cachedData.mobileNumber,
          countryCode: cachedData.countryCode,
          country: cachedData.country,
          currentStep: "step6",
        })
        .catch(() => {});

      // Validate code via kinship-agent codes API
      const response = await agentApi.get(
        `/api/v1/codes/validate/${encodeURIComponent(kinshipCode)}`,
      );

      if (!response.data?.valid) {
        createMessage(
          response.data?.reason || "Invalid Kinship Code. Please try again.",
          "error",
        );
        setIsLoading(false);
        return;
      }

      await saveEarlyAccess(cachedData, kinshipCode, false);
    } catch {
      createMessage("Unable to verify Kinship Code.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const createMessage = (message: string, type: "error" | "success") => {
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);

    if (msgTimeoutRef.current) {
      clearTimeout(msgTimeoutRef.current);
    }

    msgTimeoutRef.current = setTimeout(() => {
      setShowMsg(false);
      msgTimeoutRef.current = null;
    }, 4000);
  };

  const handleBackNavigation = () => {
    const updatedData = { ...cachedData, currentStep: "5" };
    localStorage.setItem("early-access-data", JSON.stringify(updatedData));
    setCachedData(updatedData);
    if (onBack) onBack();
  };

  return (
    <>
      <div ref={earlyAccessRef} className="bg-[#09073A] p-10 my-10">
        <div className="lg:flex items-center justify-center">
          <EarlyAccessCircleVW />
          <div className="min-h-[29.875rem] lg:ml-[5rem] m-2  xl:w-[36.188rem] bg-[#100E59] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.125rem] pe-[3.313rem] max-md:px-5 max-md:py-8">
            <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-lg leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
              <BackArrowVW onClick={handleBackNavigation} />
              Request Early Access
            </h2>

            <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-snug lg:leading-[88%] mt-5 -tracking-[0.04em]">
              Step 6 of 6: Enter a Kinship Code from your Referrer{" "}
            </p>

            <form
              className="mt-[1.188rem] min-h-63.5 text-base max-md:text-sm font-normal"
              onSubmit={submitKinshipCode}
            >
              <div className="text-[1rem] mt-[2rem]">
                <InputVW
                  labelText="Kinship Code"
                  value={kinshipCode}
                  placeHolder="Kinship Code"
                  inputType="text"
                  isRequired={false}
                  type="kinship-code"
                  onChange={(event) => {
                    setKinshipCode(event.target.value.trim());
                    if (event.target.value) setNoCodeChecked(false);
                  }}
                  maxLength={16}
                />

                <label className="flex items-center gap-0.5 text-[#FFFFFFE5] opacity-70 text-[0.75rem] max-md:text-xs leading-[140%] mt-2 -tracking-[0.02em] cursor-pointer">
                  {
                    <input
                      type="checkbox"
                      className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem] cursor-pointer"
                      checked={noCodeChecked}
                      onChange={(e) => {
                        setNoCodeChecked(e.target.checked);
                        if (e.target.checked) setKinshipCode("");
                      }}
                    />
                  }
                  I don't have a code yet — I'll provide one later.
                </label>
              </div>

              <button
                type="submit"
                className="steps_btn_submit mt-[10.438rem] text-white font-bold btn bg-[#EB8000] border-[#FF710F33] w-full hover:bg-[#EB8000] hover:border-[#FF710F33]"
              >
                {isLoading ? <Spinner size="sm" /> : "Join Early Access"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};