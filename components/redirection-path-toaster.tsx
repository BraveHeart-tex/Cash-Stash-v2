"use client";
import { EMAIL_VERIFICATION_REDIRECTION_PATHS } from "@/lib/constants";
import { showErrorToast } from "./ui/use-toast";
import { useEffect, useState } from "react";

const RedirectionPathToaster = () => {
  const [path, setPath] = useState("");

  const showErrorToastByPath = (message: string) => {
    showErrorToast("Error", message);
  };

  useEffect(() => {
    setPath(window.location.href);
  }, []);

  useEffect(() => {
    const errorMessages = {
      [EMAIL_VERIFICATION_REDIRECTION_PATHS.INVALID_EMAIL]:
        "The email you provided is invalid.",
      [EMAIL_VERIFICATION_REDIRECTION_PATHS.EXPIRED_CODE]:
        "The code you provided is invalid.",
      [EMAIL_VERIFICATION_REDIRECTION_PATHS.INVALID_CODE]:
        "The code you provided is invalid.",
      [EMAIL_VERIFICATION_REDIRECTION_PATHS.TOO_MANY_REQUESTS]:
        "You have made too many requests. Please try again later.",
      [EMAIL_VERIFICATION_REDIRECTION_PATHS.VERIFICATION_TIMEOUT]:
        "Verification time expired. Please request a new verification code.",
    };

    const showToastByPath = () => {
      Object.entries(errorMessages).forEach(([errorPath, errorMessage]) => {
        if (path.includes(errorPath)) {
          showErrorToastByPath(errorMessage);
        }
      });
    };

    if (path) showToastByPath();
  }, [path]);

  return <></>;
};

export default RedirectionPathToaster;
