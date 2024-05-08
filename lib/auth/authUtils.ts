import { RegisterConfirmEmail } from "@/emails/register-confirm-email";
import { render } from "@react-email/render";
import { PAGE_ROUTES } from "@/lib/constants";
import { User } from "lucia";
import ForgotPasswordEmail from "@/emails/forgot-password-email";
import emailService from "@/lib/services/emailService";
import { getUser } from "@/lib/auth/session";
import { redirect } from "@/navigation";

export const sendEmailVerificationCode = async (
  email: string,
  code: string
) => {
  const emailHTML = render(
    RegisterConfirmEmail({
      validationCode: code,
      validationUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${PAGE_ROUTES.EMAIL_VERIFICATION_ROUTE}/${email}`,
    })
  );

  const options = {
    from: process.env.EMAIL_USER!,
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
    })
  );

  const options = {
    from: process.env.EMAIL_USER!,
    to: email,
    subject: "Reset your password",
    html: emailHTML,
  };

  await emailService.sendEmail(options);
};

/**
 * A higher-order function that wraps the given logic function with user redirection.
 * @param {Function} logic - The logic function to be wrapped.
 * @param {User} user - The user object.
 * @param {...any} params - The parameters to be passed to the logic function.
 * @return {Promise<T>} - The result of the logic function.
 */
export function withUserRedirect<T, P extends any[]>(
  logic: (user: User, ...params: P) => Promise<T>
): (...params: P) => Promise<T> {
  return async (...params: P) => {
    const { user } = await getUser();
    if (!user) {
      return redirect(PAGE_ROUTES.LOGIN_ROUTE);
    }

    return logic(user!, ...params);
  };
}
