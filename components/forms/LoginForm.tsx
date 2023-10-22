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
import logo from "@/app/components/Logo.svg";
import Image from "next/image";
import FormInput from "@/components/FormInput";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchemaType } from "@/schemas/LoginSchema";
import { generateFormFields } from "@/lib/utils";
import { useTransition } from "react";
import { loginAction } from "@/actions";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {
  let [isPending, startTransition] = useTransition();
  const router = useRouter();
  const loginFormFields = generateFormFields(LoginSchema);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema, {}),
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

  return (
    <Card className="w-full">
      <CardHeader>
        <Image
          src={logo}
          alt="Cash Stash"
          width={200}
          className="mb-4 md:mx-auto"
          style={{
            filter: "grayscale(1) invert(1)",
          }}
        />
        <CardTitle>Welcome!</CardTitle>
        <CardDescription>Sign in to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleLoginFormSubmit)}
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
          <Button type="submit" className="font-semibold" disabled={isPending}>
            Sign in
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
export default LoginForm;
