"use client";
import { CAPTCHA_SITE_KEY } from "@/lib/constants";
import type { PropsWithChildren } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

type GoogleCaptchaWrapperProps = PropsWithChildren;

const GoogleCaptchaWrapper = ({ children }: GoogleCaptchaWrapperProps) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={CAPTCHA_SITE_KEY ?? "NOT DEFINED"}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default GoogleCaptchaWrapper;
