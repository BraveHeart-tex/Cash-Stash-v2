import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ForgotPassword from "@/components/auth/forgot-password";
import { PAGE_ROUTES } from "@/lib/constants";
import ResendVerificationEmailInput from "@/components/resend-verification-token-input";
import { FaArrowLeft } from "react-icons/fa6";
import Logo from "@/components/logo";

const SignInHelpPage = ({
  searchParams,
}: {
  searchParams: {
    category: string;
  };
}) => {
  const category = searchParams.category;

  const renderContent = () => {
    if (category === "forgot-password") {
      return <ForgotPassword />;
    }

    return <ResendVerificationEmailInput />;
  };

  const renderTitle = () => {
    const titleByCategory: {
      [key: string]: string;
    } = {
      "forgot-password": "Forgot Password",
      "verification-token": "Verification Token",
    };

    return titleByCategory[category] || "I need help signing in";
  };

  const renderDescription = () => {
    const descriptionByCategory: {
      [key: string]: string;
    } = {
      "forgot-password": "Enter your email to reset your password",
      "verification-token": "Enter your email to get a new verification token",
    };

    return (
      descriptionByCategory[category] || "Select an option below to get started"
    );
  };

  return (
    <section
      id="sign-in-help"
      className="flex h-screen flex-col items-center justify-center p-2"
    >
      <Card className="min-w-[400px]">
        <CardHeader className="text-xl">
          <Logo width={200} height={200} className="mx-auto mb-4" />
          <CardTitle>{renderTitle()}</CardTitle>
          <CardDescription>{renderDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          {category ? (
            renderContent()
          ) : (
            <>
              <Button variant="link" className="underline">
                <Link href={PAGE_ROUTES.FORGOT_PASSWORD_ROUTE}>
                  I forgot my password
                </Link>
              </Button>
              <Button variant="link" className="underline">
                <Link href={PAGE_ROUTES.VERIFICATION_TOKEN_ROUTE}>
                  I need a new verification token
                </Link>
              </Button>
            </>
          )}
          <div className="mt-2 flex w-full items-center justify-end">
            <Button variant="link" className="p-0 underline">
              <FaArrowLeft className="mr-1" />
              <Link href={PAGE_ROUTES.LOGIN_ROUTE}>Back to sign in</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default SignInHelpPage;
