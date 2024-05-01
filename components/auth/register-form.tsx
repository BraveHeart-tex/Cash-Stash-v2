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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  register as registerUser,
  validateReCAPTCHAToken,
} from "@/server/auth";
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
import { useTransition } from "react";
import PasswordInput from "@/components/auth/password-input";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Logo from "@/components/logo";
import { Link, useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import DOMPurify from "isomorphic-dompurify";

const RegisterForm = () => {
  const t = useTranslations("Components.RegisterForm");
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
      toast.error(t("captchaValidationFailedMessage"));
      return;
    }

    startTransition(async () => {
      const isCaptchaTokenValid = await validateReCAPTCHAToken(captchaToken);

      if (!isCaptchaTokenValid) {
        toast.error(t("captchaValidationFailedMessage"));
        return;
      }

      const result = await registerUser(data);

      if (result.error || result.fieldErrors.length) {
        processFormSubmissionResult(result);
        return;
      }

      router.push(PAGE_ROUTES.EMAIL_VERIFICATION_ROUTE + `/${data.email}`);

      toast.success(t("accountCreatedSuccessfullyMessage"), {
        description: t("accountCreatedSuccessfullyDescription"),
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
      toast.error(t("anErrorOccurredMessage"), {
        description: result.error,
      });
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0 },
  };

  const signInCtaQuestion = t("signInLink").split("?")[0] + "?";
  const signInCta = t("signInLink").split("?")[1];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Card className="w-full">
        <CardHeader className="text-xl">
          <Logo className="mx-auto mb-4 2xl:hidden" />
          <CardTitle>{t("formTitle")}</CardTitle>
          <CardDescription>{t("formDescription")}</CardDescription>
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
                      <FormLabel>{t("nameFieldLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("nameFieldPlaceholder")}
                          {...field}
                        />
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
                      <FormLabel>{t("emailFieldLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("emailFieldPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription
                        className="text-[0.9em]"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            t.markup("emailFieldDescription", {
                              strong: (chunks) => `<strong>${chunks}</strong> `,
                              u: (chunks) => `<u>${chunks}</u>`,
                            })
                          ),
                        }}
                      ></FormDescription>
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
                loading={isPending}
              >
                {t("submitButtonLabel")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-muted-foreground">
              {signInCtaQuestion} &nbsp;
              <Button
                variant="link"
                disabled={form.formState.isSubmitting || isPending}
                aria-label={t("signInLink")}
                className="p-0 underline"
              >
                <Link href={PAGE_ROUTES.LOGIN_ROUTE}>{signInCta}</Link>
              </Button>
            </p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
export default RegisterForm;
