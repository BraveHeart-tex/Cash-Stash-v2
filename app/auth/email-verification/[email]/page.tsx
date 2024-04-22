import { checkEmailValidityBeforeVerification } from "@/server/auth";
import EmailVerificationInput from "@/components/auth/email-verification-input";
import EmailVerificationTimer from "@/components/auth/email-verification-timer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/session";
import {
  ACCOUNT_VERIFICATION_EXPIRATION_PERIOD_DAYS,
  EMAIL_VERIFICATION_REDIRECTION_PATHS,
  PAGE_ROUTES,
} from "@/lib/constants";
import { redirect } from "next/navigation";
import ResendVerificationTokenButton from "@/components/resend-verification-token-button";
import Logo from "@/components/logo";

type EmailVerificationPageProps = {
  params: {
    email: string;
  };
};

const EmailVerificationPage = async ({
  params,
}: EmailVerificationPageProps) => {
  const { user } = await getUser();

  if (user) {
    redirect(PAGE_ROUTES.HOME_PAGE);
  }

  const email = decodeURIComponent(params.email);

  const emailValidityResponse =
    await checkEmailValidityBeforeVerification(email);

  if (!emailValidityResponse.hasValidVerificationCode) {
    redirect(EMAIL_VERIFICATION_REDIRECTION_PATHS.INVALID_EMAIL);
  }

  return (
    <section
      id="email-verification"
      className="flex h-screen flex-col items-center justify-center p-2"
    >
      <Card>
        <CardHeader className="text-xl">
          <Logo width={200} height={200} className="mx-auto mb-4" />
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            An email has been sent to <b>{email}</b>. Please enter the
            verification code to the field below. <br />
            Make sure to check your spam folder if you do not see the email in
            your inbox. <br />
            <u>
              Unverified accounts will be deleted after{" "}
              {ACCOUNT_VERIFICATION_EXPIRATION_PERIOD_DAYS} days.
            </u>
          </CardDescription>
          <EmailVerificationTimer time={emailValidityResponse.timeLeft} />
          <EmailVerificationInput email={email} />
        </CardContent>
        <CardFooter>
          <div className="flex items-center text-sm">
            <p>Didn't receive the email?</p>
            <ResendVerificationTokenButton email={email} />
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};
export default EmailVerificationPage;
