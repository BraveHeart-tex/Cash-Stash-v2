import LoginForm from "@/components/auth/login-form";
import Logo from "@/components/logo";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import Link from "next/link";
import { redirect } from "@/navigation";
import { getTranslations } from "next-intl/server";

const LoginPage = async () => {
  const { user } = await getUser();
  if (user) {
    redirect(PAGE_ROUTES.HOME_PAGE);
  }

  const t = await getTranslations("Login");

  return (
    <section
      id="login-page"
      className="flex min-h-screen items-center justify-center"
    >
      <div className="grid w-full grid-cols-1 items-center 2xl:grid-cols-2">
        <div className="relative hidden h-screen flex-col items-center justify-center bg-muted 2xl:flex">
          <Logo
            className="monokai-dark:invert dark:invert"
            width={400}
            height={400}
          />
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
          <LoginForm
            internationalizationConfig={{
              loggedInHeading: t("loggedInHeading"),
              loggedInDescription: t("loggedInDescription"),
              loginHeading: t("loginHeading"),
              loginDescription: t("loginDescription"),
              captchaError: t("captchaError"),
              loginSuccessMessage: t("loginSuccessMessage"),
              formErrorMessage: t("formErrorMessage"),
              emailFieldLabel: t("emailFieldLabel"),
              emailFieldPlaceholder: t("emailFieldPlaceholder"),
              passwordFieldLabel: t("passwordFieldLabel"),
              passwordFieldPlaceholder: t("passwordFieldPlaceholder"),
              passwordFieldCapsLockMessage: t("passwordFieldCapsLockMessage"),
              signInButtonLabel: t("signInButtonLabel"),
              signInHelpMessage: t("signInHelpMessage"),
              signUpText: t("signUpText"),
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
