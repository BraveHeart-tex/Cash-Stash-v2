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
import { zodResolver } from "@hookform/resolvers/zod";
import { generateFormFields } from "@/lib/utils";
import { useTransition } from "react";
import { registerAction } from "@/actions";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RegisterSchema, { RegisterSchemaType } from "@/schemas/RegisterSchema";

const SignUpForm = () => {
  let [isPending, startTransition] = useTransition();
  const registerFormFields = generateFormFields(RegisterSchema);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
  });

  const handleRegisterFormSubmit = (data: RegisterSchemaType) => {
    startTransition(async () => {
      registerAction(data).then((result) => {
        if (result?.error)
          return showErrorToast("An error occurred.", result.error);
        router.push("/");
        showSuccessToast("Signed up.", "You have been signed up.");
      });
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
        <CardDescription>Get started by creating your account.</CardDescription>
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
          <Button type="submit" className="font-semibold" disabled={isPending}>
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
  );
};
export default SignUpForm;
