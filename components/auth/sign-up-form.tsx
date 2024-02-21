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
import FormInput from "@/components/form-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateFormFields } from "@/lib/utils";
import { useTransition } from "react";
import { register as registerUser } from "@/actions/auth";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import registerSchema, { RegisterSchemaType } from "@/schemas/register-schema";
import { motion } from "framer-motion";

const SignUpForm = () => {
  let [isPending, startTransition] = useTransition();
  const registerFormFields = generateFormFields(registerSchema);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegisterFormSubmit = (data: RegisterSchemaType) => {
    startTransition(async () => {
      const result = await registerUser(data);

      if (result.error || result.fieldErrors.length) {
        processFormErrors(result);
        return;
      }

      router.push("/");
      showSuccessToast("Signed up.", "You have been signed up.");
    });
  };

  const processFormErrors = (
    result: Awaited<ReturnType<typeof registerUser>>
  ) => {
    if (result.fieldErrors.length) {
      result.fieldErrors.forEach((fieldError) => {
        setError(fieldError.field as any, {
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
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleRegisterFormSubmit)}
          >
            <div className="grid grid-cols-1 gap-4">
              {registerFormFields.map((field) => (
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
              type="submit"
              className="font-semibold"
              disabled={isPending}
            >
              Sign up
            </Button>
          </form>
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
