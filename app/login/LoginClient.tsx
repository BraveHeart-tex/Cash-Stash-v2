"use client";
import LoginForm from "@/components/forms/LoginForm";

const LoginClient = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 gap-4">
      <div className="w-full md:w-[700px]">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginClient;
