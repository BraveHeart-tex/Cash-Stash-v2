import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import logo from "@/components/Logo.svg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ForgotPassword from "@/components/auth/forgot-password";
import { PAGE_ROUTES } from "@/lib/constants";
import ResendNotificationInput from "@/components/resend-verification-token-input";

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

    return <ResendNotificationInput />;
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
    <div className="flex flex-col justify-center items-center h-screen p-2">
      <Card className="min-w-[400px]">
        <CardHeader className="text-xl">
          <Image
            src={logo}
            alt="Cash Stash"
            width={200}
            className="mb-4 md:mx-auto dark:invert"
          />
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
              <Button variant="link" className="underline">
                <Link href={PAGE_ROUTES.LOGIN_ROUTE}>Back to sign in</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInHelpPage;
