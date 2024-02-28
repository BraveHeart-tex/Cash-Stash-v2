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
import logo from "@/components/Logo.svg";
import ResetPasswordForm from "@/components/reset-password-form";

interface IResetPasswordPageProps {
  params: {
    email: string;
  };
  searchParams: {
    token: string;
  };
}

const ResetPassword = async ({
  params,
  searchParams,
}: IResetPasswordPageProps) => {
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
    <div className="flex flex-col justify-center items-center h-screen p-2">
      <Card className="w-full lg:w-[600px]">
        <CardHeader className="text-xl">
          <Image
            src={logo}
            alt="Cash Stash"
            width={200}
            className="mb-4 md:mx-auto dark:invert"
          />
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Use the form below to set your new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm email={email} token={token} />
        </CardContent>
      </Card>
    </div>
  );
};
export default ResetPassword;
