import ForgotPasswordEmail from "@/emails/forgot-password-email";
import { RegisterConfirmEmail } from "@/emails/register-confirm-email";
import { env } from "@/env";
import { getUser } from "@/lib/auth/session";
import { PAGE_ROUTES } from "@/lib/constants";
import emailService from "@/lib/services/emailService";
import { redirect } from "@/navigation";
import type { AuthenticatedFunction, OptionalParameter } from "@/typings/auth";
import { render } from "@react-email/render";
import type { User } from "lucia";

export const sendEmailVerificationCode = async (
  email: string,
  code: string,
) => {
  const emailHTML = render(
    RegisterConfirmEmail({
      validationCode: code,
      validationUrl: `${env.NEXT_PUBLIC_BASE_URL}${PAGE_ROUTES.EMAIL_VERIFICATION_ROUTE}/${email}`,
    }),
  );

  const options = {
    from: env.EMAIL_USER as string,
    to: email,
    subject: "Confirm your email address",
    html: emailHTML,
  };

  await emailService.sendEmail(options);
};

export const sendResetPasswordLink = async (email: string, url: string) => {
  const emailHTML = render(
    ForgotPasswordEmail({
      url,
    }),
  );

  const options = {
    from: env.EMAIL_USER,
    to: email,
    subject: "Reset your password",
    html: emailHTML,
  };

  await emailService.sendEmail(options);
};

export function authenticatedAction<T, P = undefined>(
  logic: AuthenticatedFunction<T, P>,
  // eslint-disable-next-line no-unused-vars
): (params: OptionalParameter<AuthenticatedFunction<T, P>>) => Promise<T> {
  return async (params: OptionalParameter<AuthenticatedFunction<T, P>>) => {
    const { user } = await getUser();

    if (!user) {
      return redirect(PAGE_ROUTES.LOGIN_ROUTE);
    }

    return logic(params as P, { user });
  };
}

export function authenticatedActionWithNoParams<T>(
  // eslint-disable-next-line no-unused-vars
  logic: (user: User) => Promise<T>,
) {
  return async () => {
    const { user } = await getUser();

    if (!user) {
      return redirect(PAGE_ROUTES.LOGIN_ROUTE);
    }

    return logic(user);
  };
}
