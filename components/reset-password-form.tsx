"use client";

import PasswordInput from "@/components/auth/password-input";
import PasswordRequirements from "@/components/auth/password-requirements";
import { Button } from "@/components/ui/button";
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
import { PAGE_ROUTES } from "@/lib/constants";
import useZodResolver from "@/lib/zod-resolver-wrapper";
import { useRouter } from "@/navigation";
import resetPasswordSchema, {
  type ResetPasswordSchemaType,
} from "@/schemas/reset-password-schema";
import { resetPassword } from "@/server/auth";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type ResetPasswordFormProps = {
  email: string;
  token: string;
};

const ResetPasswordForm = ({ email, token }: ResetPasswordFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<ResetPasswordSchemaType>({
    resolver: useZodResolver(resetPasswordSchema),
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
