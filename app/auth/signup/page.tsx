import { getUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/register-form";
import { PAGE_ROUTES } from "@/lib/constants";

const SignUpPage = async () => {
  const { user } = await getUser();
  if (user) {
    redirect(PAGE_ROUTES.HOME_PAGE);
  }

  return (
    <section
      id="sign-up"
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="w-full md:w-[700px]">
        <RegisterForm />
      </div>
    </section>
  );
};

export default SignUpPage;
