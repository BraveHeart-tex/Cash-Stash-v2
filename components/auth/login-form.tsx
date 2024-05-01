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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLoginSchema, LoginSchemaType } from "@/schemas/login-schema";
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
import LoggedInIllustration from "@/components/logged-in-illustration";
import Logo from "@/components/logo";

type LoginFormProps = {
  internationalizationConfig: {
    loggedInHeading: string;
    loggedInDescription: string;
    loginHeading: string;
    loginDescription: string;
    captchaError: string;
    loginSuccessMessage: string;
    formErrorMessage: string;
    emailFieldLabel: string;
    emailFieldPlaceholder: string;
    signInButtonLabel: string;
    signInHelpMessage: string;
    signUpText: string;
    invalidEmail: string;
    passwordTooShort: string;
    passwordTooLong: string;
    twoFactorFormTitle: string;
    twoFactorFormDescription: string;
    twoFactorFormCodeLabel: string;
    twoFactorFormButtonLabel: string;
  };
};

const LoginForm = ({ internationalizationConfig }: LoginFormProps) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  let [isPending, startTransition] = useTransition();
  const [showTwoFactorForm, setShowTwoFactorForm] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  const {
    loggedInHeading,
    loggedInDescription,
    loginHeading,
    loginDescription,
    captchaError,
    loginSuccessMessage,
    formErrorMessage,
    emailFieldLabel,
    emailFieldPlaceholder,
    signInButtonLabel,
    signInHelpMessage,
    signUpText,
    invalidEmail,
    passwordTooLong,
    passwordTooShort,
    twoFactorFormCodeLabel,
    twoFactorFormDescription,
    twoFactorFormTitle,
    twoFactorFormButtonLabel,
  } = internationalizationConfig;
  const loginSchema = getLoginSchema({
    invalidEmail,
    passwordTooShort,
    passwordTooLong,
  });

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const handleLoginFormSubmit = async (data: LoginSchemaType) => {
    if (!executeRecaptcha) return;
    startTransition(async () => {
      let captchaToken = await executeRecaptcha();
      const isCaptchaTokenValid = await validateReCAPTCHAToken(captchaToken);

      if (!isCaptchaTokenValid) {
        toast.error(captchaError);
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
      toast.success(loginSuccessMessage);
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
      toast.error(formErrorMessage, {
        description: result.error,
      });
    }
  };

  if (loggedIn) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <LoggedInIllustration />
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight text-primary">
          {loggedInHeading}
        </h1>
        <span className="text-muted-foreground">{loggedInDescription}</span>
      </div>
    );
  }

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const signUpQuestion = signUpText.split("? ")[0] + "?";
  const signUpCTA = signUpText.split("? ")[1];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {showTwoFactorForm ? (
        <TwoFactorAuthenticationForm
          internationalizationConfig={{
            twoFactorFormCodeLabel,
            twoFactorFormDescription,
            twoFactorFormTitle,
            twoFactorFormButtonLabel,
          }}
          email={form.getValues("email")}
        />
      ) : (
        <Card className="w-full">
          <CardHeader className="text-xl">
            <Logo
              width={200}
              height={200}
              className="mx-auto mb-4 2xl:hidden"
            />
            <CardTitle>{loginHeading}</CardTitle>
            <CardDescription>{loginDescription}</CardDescription>
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
                        <FormLabel>{emailFieldLabel}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={emailFieldPlaceholder}
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
                  name="sign-in-btn"
                  aria-label={signInButtonLabel}
                  className="font-semibold"
                  disabled={isPending}
                  data-testid="login-button"
                >
                  {signInButtonLabel}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="flex w-full flex-col gap-2 lg:flex-row lg:justify-between ">
              <p className="text-sm text-muted-foreground">
                {signUpQuestion}{" "}
                <Button
                  disabled={isPending}
                  variant="link"
                  aria-label={signUpCTA}
                  className="p-0 underline"
                >
                  <Link href={PAGE_ROUTES.SIGN_UP_ROUTE}>{signUpCTA}</Link>
                </Button>
              </p>
              <Button
                disabled={isPending}
                variant="link"
                aria-label={signInHelpMessage}
                className="w-max p-0 underline"
              >
                <Link href={PAGE_ROUTES.SIGN_IN_HELP_ROUTE}>
                  {signInHelpMessage}
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
