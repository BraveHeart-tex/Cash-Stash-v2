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
import errorMap from "@/lib/utils";
import { useTransition } from "react";
import { registerAction } from "@/actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RegisterSchema, { RegisterSchemaType } from "@/schemas/RegisterSchema";

const SignUpForm = () => {
  const { toast } = useToast();
  let [isPending, startTransition] = useTransition();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    // @ts-ignore
    resolver: zodResolver(RegisterSchema, {
      errorMap: errorMap,
    }),
  });

  const handleRegisterFormSubmit = (data: RegisterSchemaType) => {
    startTransition(async () => {
      const result = await registerAction(data);
      if (result.error) {
        console.log(result.error);
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
          duration: 5000,
        });
      } else {
        toast({
          title: "Successfully signed up.",
          description: "We have created your account for you.",
          variant: "default",
          duration: 5000,
        });
        router.push("/");
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
          className="mb-4 dark:brightness-0 md:mx-auto"
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
            <FormInput
              name={"name"}
              label={"Full Name"}
              placeholder={"Full Name"}
              type={"text"}
              register={register}
              errors={errors}
            />
            <FormInput
              name={"email"}
              label={"Email"}
              placeholder={"Email address"}
              type={"email"}
              register={register}
              errors={errors}
            />
            <FormInput
              name={"password"}
              label={"Password"}
              placeholder={"Password"}
              type={"password"}
              register={register}
              errors={errors}
            />
          </div>
          <Button type="submit" className="font-semibold" disabled={isPending}>
            Sign in
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
