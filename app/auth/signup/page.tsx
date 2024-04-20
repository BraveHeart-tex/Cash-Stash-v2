import { getUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/register-form";
import { PAGE_ROUTES } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

const SignUpPage = async () => {
  const { user } = await getUser();
  if (user) {
    redirect(PAGE_ROUTES.HOME_PAGE);
  }

  return (
    <section
      id="register-page"
      className="flex min-h-screen items-center justify-center"
    >
      <div className="grid grid-cols-1 2xl:grid-cols-2 min-h-screen w-full items-center">
        <div className="relative items-center justify-center flex-col hidden 2xl:flex bg-muted h-screen">
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={400}
            height={400}
            className="dark:invert logo-light"
          />
          <p className="absolute bottom-2 right-2 text-xs">
            Made by{" "}
            <Link
              href="https://www.borakaraca.tech"
              target="_blank"
              className="hover:underline text-primary"
            >
              Bora Karaca
            </Link>
          </p>
        </div>
        <div className="w-full md:w-[700px] mx-auto p-2 lg:p-0">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
