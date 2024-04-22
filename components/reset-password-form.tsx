"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import resetPasswordSchema, {
  ResetPasswordSchemaType,
} from "@/schemas/reset-password-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { resetPassword } from "@/server/auth";
import { useRouter } from "next/navigation";
import { PAGE_ROUTES } from "@/lib/constants";
import { toast } from "sonner";
import PasswordInput from "@/components/auth/password-input";
import PasswordRequirements from "@/components/auth/password-requirements";

type ResetPasswordFormProps = {
  email: string;
  token: string;
};

const ResetPasswordForm = ({ email, token }: ResetPasswordFormProps) => {
  let [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordSchemaType) => {
    startTransition(async () => {
      const response = await resetPassword({
        email,
        token,
        password: data.password,
      });

      if (response.error) {
        toast.error(response.error);
        router.push(PAGE_ROUTES.LOGIN_ROUTE);
        return;
      }

      router.push(PAGE_ROUTES.HOME_PAGE);
      toast.success(response.successMessage ?? "Password reset successfully");
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <div>
              <PasswordInput field={field} />
              <PasswordRequirements password={field.value} />
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repeat Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Repeat your password"
                  {...field}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
