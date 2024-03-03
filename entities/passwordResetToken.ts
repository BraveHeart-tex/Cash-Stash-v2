export interface PasswordResetToken {
  id: string;
  user_id: string;
  expires_At: Date;
}
