import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import logo from "@/components/Logo.svg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ForgotPassword from "@/components/auth/forgot-password";

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

    return null;
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen p-2">
      <Card>
        <CardHeader className="text-xl">
          <Image
            src={logo}
            alt="Cash Stash"
            width={200}
            className="mb-4 md:mx-auto dark:invert"
          />
          <CardTitle>I need help signing in</CardTitle>
          <CardDescription>
            Select one of the following options to get help signing in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {category ? (
            renderContent()
          ) : (
            <>
              <Button variant="link" className="underline">
                <Link href="/auth/help?category=forgot-password">
                  I forgot my password
                </Link>
              </Button>
              <Button variant="link" className="underline">
                <Link href="/auth/help?category=verification-token">
                  I need a new verification token
                </Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInHelpPage;
