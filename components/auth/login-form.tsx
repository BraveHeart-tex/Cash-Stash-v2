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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import loginSchema, { LoginSchemaType } from "@/schemas/login-schema";
import { useState, useTransition } from "react";
import { login } from "@/actions/auth";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
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

const LoginForm = () => {
  let [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const handleLoginFormSubmit = (data: LoginSchemaType) => {
    startTransition(async () => {
      const result = await login(data);
      if (result?.error) {
        processFormErrors(result);
      } else {
        router.push("/");
        setLoggedIn(true);
        showSuccessToast("Logged in.", "You have been logged in.");
      }
    });
  };

  const processFormErrors = (result: Awaited<ReturnType<typeof login>>) => {
    if (result.fieldErrors.length) {
      result.fieldErrors.forEach((fieldError) => {
        form.setError(fieldError.field as any, {
          type: "manual",
          message: fieldError.message,
        });
      });
    }

    if (result.error) {
      showErrorToast("An error occurred.", result.error);
    }
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
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(handleLoginFormSubmit)}
              data-testid="login-form"
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
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
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
        </CardFooter>
      </Card>
    </motion.div>
  );
};
export default LoginForm;
