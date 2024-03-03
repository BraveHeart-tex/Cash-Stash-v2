export interface EmailVerificationCode {
  id: string;
  code: string;
  userId: string;
  email: string;
  expiresAt: string;
}
