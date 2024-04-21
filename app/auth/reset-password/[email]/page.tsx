import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import Image from "next/image";
import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/reset-password-form";

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
    redirect(PAGE_ROUTES.HOME_PAGE);
  }

  return (
    <section
      id="reset-password"
      className="flex h-screen flex-col items-center justify-center p-2"
    >
      <Card className="w-full lg:w-[600px]">
        <CardHeader className="text-xl">
          <Image
            src={"/logo.svg"}
            alt="Cash Stash"
            width={200}
            height={200}
            className="mb-4 dark:invert md:mx-auto"
          />
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
