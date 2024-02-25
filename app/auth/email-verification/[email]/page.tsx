import { checkEmailValidityBeforeVerification } from "@/actions/auth";
import CountDownTimer from "@/components/countdown-timer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import { redirect } from "next/navigation";

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

  const email = params.email;
  //   const userWithEmail = await checkEmailValidityBeforeVerification(email);
  //   if (!userWithEmail) {
  //     redirect(PAGE_ROUTES.LOGIN_ROUTE + "?error=invalid-email");
  //   }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            An email has been sent to {email}. Please verify your email address
            to continue.
          </CardDescription>
          <CountDownTimer
            timer={5 * 60}
            options={{
              showMinutes: true,
              showSeconds: true,
              progressBarType: "circular",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default EmailVerificationPage;
