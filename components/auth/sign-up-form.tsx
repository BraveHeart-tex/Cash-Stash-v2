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
import { useRouter } from "next/navigation";
import Link from "next/link";
import registerSchema, { RegisterSchemaType } from "@/schemas/register-schema";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const SignUpForm = () => {
  const router = useRouter();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegisterFormSubmit = async (data: RegisterSchemaType) => {
    const result = await registerUser(data);

    if (result.error || result.fieldErrors.length) {
      processFormErrors(result);
      return;
    }

    router.push("/");
    showSuccessToast("Signed up.", "You have been signed up.");
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
      <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
      <Card className="w-full">
        <CardHeader>
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
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="font-semibold"
                disabled={form.formState.isSubmitting}
              >
                Sign up
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
export default SignUpForm;
