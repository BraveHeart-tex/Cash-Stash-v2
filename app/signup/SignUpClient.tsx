"use client";
import SignUpForm from "@/components/auth/sign-up-form";

const SignUpClient = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full md:w-[700px]">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpClient;
