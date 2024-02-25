import { checkEmailValidityBeforeVerification } from "@/actions/auth";
import EmailVerificationInput from "@/components/auth/email-verification-input";
import EmailVerificationTimer from "@/components/auth/email-verification-timer";
import logo from "@/components/Logo.svg";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/session";
import { resendEmailVerificationCode } from "@/actions/auth";
import {
  EMAIL_VERIFICATION_REDIRECTION_PATHS,
  PAGE_ROUTES,
} from "@/lib/constants";
import Image from "next/image";
import { redirect } from "next/navigation";
import ResendVerificationTokenButton from "@/components/resend-verification-token-button";

interface IEmailVerificationPageProps {
  params: {
    email: string;
  };
}

const EmailVerificationPage = async ({
  params,
}: IEmailVerificationPageProps) => {
  const { user } = await getUser();

  if (user) {
    redirect(PAGE_ROUTES.HOME_PAGE);
  }

  const email = decodeURIComponent(params.email);

  const emailValidityResponse =
    await checkEmailValidityBeforeVerification(email);

  if (!emailValidityResponse.hasValidVarficationCode) {
    redirect(EMAIL_VERIFICATION_REDIRECTION_PATHS.INVALID_EMAIL);
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen p-2">
      <Card>
        <CardHeader className="text-xl">
          <Image
            src={logo}
            alt="Cash Stash"
            width={200}
            className="mb-4 md:mx-auto dark:invert"
          />
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            An email has been sent to <b>{email}</b>. Please enter the
            verification code to the field below. <br />
            Make sure to check your spam folder if you do not see the email in
            your inbox.
          </CardDescription>
          <EmailVerificationTimer time={emailValidityResponse.timeLeft} />
          <EmailVerificationInput email={email} />
        </CardContent>
        <CardFooter>
          <div className="text-sm flex items-center">
            <p>Didn't receive the email?</p>
            <ResendVerificationTokenButton email={email} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
export default EmailVerificationPage;
