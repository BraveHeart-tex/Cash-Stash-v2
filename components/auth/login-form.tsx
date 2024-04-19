"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import loginSchema, { LoginSchemaType } from "@/schemas/login-schema";
import { useState, useTransition } from "react";
import { login, validateReCAPTCHAToken } from "@/server/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PAGE_ROUTES } from "@/lib/constants";
import TwoFactorAuthenticationForm from "@/components/auth/two-factor-authentication-form";
import PasswordInput from "@/components/auth/password-input";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const LoginForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  let [isPending, startTransition] = useTransition();
  const [showTwoFactorForm, setShowTwoFactorForm] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const handleLoginFormSubmit = async (data: LoginSchemaType) => {
    if (!executeRecaptcha) return;
    startTransition(async () => {
      let captchaToken = await executeRecaptcha();
      const isCaptchaTokenValid = await validateReCAPTCHAToken(captchaToken);

      if (!isCaptchaTokenValid) {
        toast.error("Captcha validation failed.");
        return;
      }

      const result = await login(data);

      if (result.twoFactorAuthenticationRequired) {
        setShowTwoFactorForm(true);
        return;
      }

      if (result.error) {
        processFormSubmissionResult(result);
        return;
      }

      router.push(PAGE_ROUTES.HOME_PAGE);
      setLoggedIn(true);
      toast.success("Logged in successfully.");
    });
  };

  const processFormSubmissionResult = (
    result: Awaited<ReturnType<typeof login>>
  ) => {
    if (result.fieldErrors.length) {
      result.fieldErrors.forEach((fieldError) => {
        form.setError(fieldError.field as any, {
          type: "manual",
          message: fieldError.message,
        });
      });
    }

    if (result.error) {
      toast.error("An error occurred.", {
        description: result.error,
      });
    }
  };

  if (loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <Image
          src="/logging-in-dark.svg"
          width={300}
          height={300}
          alt="logging in"
          className="hidden dark:block"
        />
        <Image
          src="/logging-in.svg"
          width={300}
          height={300}
          alt="logging in"
          className="block dark:hidden"
        />
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight text-primary">
          Logged in successfully.
        </h1>
        <span className="text-muted-foreground">
          You are being redirected...
        </span>
      </div>
    );
  }

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {showTwoFactorForm ? (
        <TwoFactorAuthenticationForm email={form.getValues("email")} />
      ) : (
        <Card className="w-full">
          <CardHeader className="text-xl">
            <Image
              src={"/logo.svg"}
              alt="Cash Stash"
              width={200}
              height={200}
              className="mb-4 mx-auto dark:invert block 2xl:hidden"
            />
            <CardTitle>Welcome!</CardTitle>
            <CardDescription>Sign in to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(handleLoginFormSubmit)}
                data-testid="login-form"
                name="login-form"
                aria-label="login-form"
              >
                <div className="grid grid-cols-1 gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <PasswordInput<LoginSchemaType> field={field} />
                    )}
                  />
                </div>
                <Button
                  loading={isPending}
                  type="submit"
                  name="Login to your account"
                  className="font-semibold"
                  disabled={isPending}
                  data-testid="login-button"
                >
                  Sign in
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col gap-2 lg:flex-row lg:justify-between w-full ">
              <p className="text-muted-foreground text-sm">
                Don't have an account?{" "}
                <Button
                  disabled={isPending}
                  variant="link"
                  aria-label="Sign up for a new account."
                  className="p-0 underline"
                >
                  <Link
                    href={PAGE_ROUTES.SIGN_UP_ROUTE}
                    aria-label="Sign up for a new account."
                  >
                    Sign up
                  </Link>
                </Button>
              </p>
              <Button
                disabled={isPending}
                variant="link"
                aria-label="Sign up for a new account."
                className="w-max p-0 underline"
              >
                <Link
                  href={PAGE_ROUTES.SIGN_IN_HELP_ROUTE}
                  aria-label="Sign up for a new account."
                >
                  I need help signing in
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </motion.div>
  );
};
export default LoginForm;
