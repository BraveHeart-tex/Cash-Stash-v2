"use client";
import { CAPTCHA_SITE_KEY } from "@/lib/constants";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const GoogleCaptchaWrapper = ({ children }: { children: React.ReactNode }) => {
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
