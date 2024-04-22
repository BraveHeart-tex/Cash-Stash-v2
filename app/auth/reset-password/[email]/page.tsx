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
import ResetPasswordForm from "@/components/reset-password-form";
import Logo from "@/components/logo";
import { checkResetPasswordEmailAndToken } from "@/server/auth";

type ResetPasswordPageProps = {
  params: {
    email: string;
  };
  searchParams: {
    token: string;
  };
};

const ResetPassword = async ({
  params,
  searchParams,
}: ResetPasswordPageProps) => {
  const { user } = await getUser();
  if (user) {
    redirect(PAGE_ROUTES.HOME_PAGE);
  }

  const email = decodeURIComponent(params.email);
  const token = searchParams.token;

  if (!email || !token) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  const emailValidityResponse = await checkResetPasswordEmailAndToken({
    email,
    token,
  });

  if (emailValidityResponse.error) {
    redirect(PAGE_ROUTES.LOGIN_ROUTE);
  }

  return (
    <section
      id="reset-password"
      className="flex h-screen flex-col items-center justify-center p-2"
    >
      <Card className="w-full lg:w-[600px]">
        <CardHeader className="text-xl">
          <Logo className="mx-auto mb-4" width={200} height={200} />
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Please use the form below to create your new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm email={email} token={token} />
        </CardContent>
      </Card>
    </section>
  );
};
export default ResetPassword;
