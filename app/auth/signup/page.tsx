import { getUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/register-form";

const SignUpPage = async () => {
  const { user } = await getUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full md:w-[700px]">
        <RegisterForm />
      </div>
    </div>
  );
};

export default SignUpPage;
