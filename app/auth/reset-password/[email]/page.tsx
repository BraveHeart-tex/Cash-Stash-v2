import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import { redirect } from "next/navigation";

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

  return <div>ResetPassword</div>;
};
export default ResetPassword;
