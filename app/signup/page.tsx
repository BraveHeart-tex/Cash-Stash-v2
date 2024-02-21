import { getUser } from "@/lib/session";
import { redirect } from "next/navigation";
import SignUpForm from "@/components/auth/sign-up-form";

const SignUpPage = async () => {
  const { user } = await getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full md:w-[700px]">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
