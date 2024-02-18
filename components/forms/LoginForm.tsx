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
import logo from "@/components/Logo.svg";
import Image from "next/image";
import FormInput from "@/components/FormInput";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchemaType } from "@/schemas/LoginSchema";
import { generateFormFields } from "@/lib/utils";
import { useState, useTransition } from "react";
import { loginAction } from "@/actions";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const LoginForm = () => {
  let [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const loginFormFields = generateFormFields(LoginSchema);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const handleLoginFormSubmit = (data: LoginSchemaType) => {
    startTransition(async () => {
      const result = await loginAction(data);
      if (result?.error) {
        showErrorToast("An error occurred.", result.error);
      } else {
        router.push("/");
        showSuccessToast("Logged in.", "You have been logged in.");
      }
    });
  };

  const handleTestUserLogin = () => {
    startTransition(async () => {
      const result = await loginAction({
        email: "testUser@email.com",
        password: "testUser123!",
      });

      if (result?.error) {
        showErrorToast("An error occurred.", result.error);
      } else {
        setLoggedIn(true);
        router.push("/");
        showSuccessToast("Logged in.", "You have been logged in.");
      }
    });
  };

  if (loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <h1 className="text-2xl font-semibold text-primary">
          Logged in successfully.
        </h1>
        <span className="animate-bounce">You are being redirected...</span>
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
      <Card className="w-full">
        <CardHeader>
          <Image
            src={logo}
            alt="Cash Stash"
            width={200}
            className="mb-4 md:mx-auto dark:invert"
          />
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>Sign in to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleLoginFormSubmit)}
            data-testid="login-form"
          >
            <div className="grid grid-cols-1 gap-4">
              {loginFormFields.map((field) => (
                <FormInput
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  placeholder={field.label}
                  type={field.type}
                  register={register}
                  errors={errors}
                />
              ))}
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
        </CardContent>
        <CardFooter className="justify-between">
          <div>
            <p className="text-sm text-center">
              Don't have an account?{" "}
              <Link
                href="/signup"
                aria-label="Sign up for a new account."
                className="text-blue-500 hover:underline"
                data-testid="signup-link"
              >
                Sign up
              </Link>
            </p>
          </div>
          <Button
            name="Login as a test user"
            disabled={isPending}
            variant="ghost"
            className="font-normal text-sm"
            onClick={() => handleTestUserLogin()}
          >
            Login as a test user
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
export default LoginForm;
