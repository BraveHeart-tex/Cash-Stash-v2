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
import { register as registerUser } from "@/actions/auth";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
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

const RegisterForm = () => {
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });
  const router = useRouter();

  const handleRegisterFormSubmit = async (data: RegisterSchemaType) => {
    const result = await registerUser(data);

    if (result.error || result.fieldErrors.length) {
      processFormErrors(result);
      return;
    }

    router.push(PAGE_ROUTES.EMAIL_VERIFICATION_ROUTE + `/${data.email}`);

    showSuccessToast(
      "Account created successfully",
      "Please check your email to verify your account."
    );
  };

  const processFormErrors = (
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
      showErrorToast("An error occurred.", result.error);
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
            src={logo}
            alt="Cash Stash"
            width={200}
            className="mb-4 md:mx-auto dark:invert"
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
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter a strong password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <PasswordRequirements password={field.value} />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="font-semibold"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full gap-2">
            <p>
              Already have an account?{" "}
              <Button
                variant="link"
                aria-label="Sign up for a new account."
                className="p-0 underline text-md"
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
