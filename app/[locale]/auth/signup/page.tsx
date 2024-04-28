import { getUser } from "@/lib/auth/session";
import { redirect } from "@/navigation";
import RegisterForm from "@/components/auth/register-form";
import { PAGE_ROUTES } from "@/lib/constants";
import Link from "next/link";
import Logo from "@/components/logo";

const SignUpPage = async () => {
  const { user } = await getUser();
  if (user) {
    return redirect(PAGE_ROUTES.HOME_PAGE);
  }

  return (
    <section
      id="register-page"
      className="flex min-h-screen items-center justify-center"
    >
      <div className="grid min-h-screen w-full grid-cols-1 items-center 2xl:grid-cols-2">
        <div className="relative hidden h-screen flex-col items-center justify-center bg-muted 2xl:flex">
          <Logo width={400} height={400} />
          <p className="absolute bottom-2 right-2 text-xs">
            Made by{" "}
            <Link
              href="https://www.borakaraca.tech"
              target="_blank"
              className="text-primary hover:underline"
            >
              Bora Karaca
            </Link>
          </p>
        </div>
        <div className="mx-auto w-full p-2 md:w-[700px] lg:p-0">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
