export interface TwoFactorAuthenticationSecret {
  id: string;
  secret: string;
  userId: string;
  createdAt: Date;
}
