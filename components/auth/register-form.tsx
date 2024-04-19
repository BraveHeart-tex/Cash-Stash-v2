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
import {
  register as registerUser,
  validateReCAPTCHAToken,
} from "@/server/auth";
import Link from "next/link";
import registerSchema, { RegisterSchemaType } from "@/schemas/register-schema";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PasswordRequirements from "@/components/auth/password-requirements";
import { PAGE_ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import PasswordInput from "@/components/auth/password-input";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const RegisterForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });
  const router = useRouter();

  const handleRegisterFormSubmit = async (data: RegisterSchemaType) => {
    if (!executeRecaptcha) return;
    let captchaToken = await executeRecaptcha();

    if (!captchaToken) {
      toast.error("Captcha validation failed.");
      return;
    }

    startTransition(async () => {
      const isCaptchaTokenValid = await validateReCAPTCHAToken(captchaToken);

      if (!isCaptchaTokenValid) {
        toast.error("Captcha validation failed.");
        return;
      }

      const result = await registerUser(data);

      if (result.error || result.fieldErrors.length) {
        processFormSubmissionResult(result);
        return;
      }

      router.push(PAGE_ROUTES.EMAIL_VERIFICATION_ROUTE + `/${data.email}`);

      toast.success("Account created successfully", {
        description: "Please check your email to verify your account.",
      });
    });
  };

  const processFormSubmissionResult = (
    result: Awaited<ReturnType<typeof registerUser>>
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

  const formVariants = {
    hidden: { opacity: 0, y: -100 },
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
        <CardHeader className="text-xl">
          <Image
            src={"/logo.svg"}
            alt="Cash Stash"
            width={200}
            className="mb-4 mx-auto dark:invert block 2xl:hidden"
          />
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>
            Get started by creating your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(handleRegisterFormSubmit)}
            >
              <div className="grid grid-cols-1 gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Your email adress"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[0.9em]">
                        <strong>Note</strong>: Please provide a valid email
                        address for{" "}
                        <u>
                          account verification, password recovery, and other
                          important communications.
                        </u>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <PasswordInput field={field} />
                      <PasswordRequirements password={field.value} />
                    </div>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="font-semibold"
                disabled={form.formState.isSubmitting || isPending}
              >
                {form.formState.isSubmitting || isPending
                  ? "Signing up..."
                  : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full gap-2">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Button
                variant="link"
                disabled={form.formState.isSubmitting || isPending}
                aria-label="Sign up for a new account."
                className="p-0 underline"
              >
                <Link href={PAGE_ROUTES.LOGIN_ROUTE}>Log In</Link>
              </Button>
            </p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
export default RegisterForm;
