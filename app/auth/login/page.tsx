import LoginForm from "@/components/auth/login-form";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const { user } = await getUser();
  if (user) {
    redirect(PAGE_ROUTES.HOME_PAGE);
  }

  return (
    <section
      id="login-page"
      className="flex min-h-screen items-center justify-center p-4 gap-4"
    >
      <div className="w-full md:w-[700px]">
        <LoginForm />
      </div>
    </section>
  );
};

export default LoginPage;
