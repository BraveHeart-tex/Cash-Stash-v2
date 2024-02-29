import { getUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { PAGE_ROUTES } from "@/lib/constants";
import TwoFactorAuthenticationForm from "@/components/auth/TwoFactorAuthenticationForm";

interface ITwoFactorAuthenticationPageProps {
  searchParams: {
    email: string;
  };
}

const TwoFactorAuthenticationPage = async ({
  searchParams,
}: ITwoFactorAuthenticationPageProps) => {
  const { user } = await getUser();
  if (user) {
    redirect(PAGE_ROUTES.HOME_PAGE);
  }

  // TODO: Validate the email and redirect to the login page if the email is not valid
  const email = decodeURIComponent(searchParams.email);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 gap-4">
      <div className="w-full md:w-[700px]">
        <TwoFactorAuthenticationForm email={email} />
      </div>
    </div>
  );
};

export default TwoFactorAuthenticationPage;
