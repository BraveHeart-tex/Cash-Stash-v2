import LoginForm from "@/components/forms/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 gap-4">
      <div className="w-full md:w-[700px]">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
