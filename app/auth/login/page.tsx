import LoginForm from "@/components/auth/login-form";
import { getUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const { user } = await getUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 gap-4">
      <div className="w-full md:w-[700px]">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
