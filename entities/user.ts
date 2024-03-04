export interface User {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  email_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  prefersTwoFactorAuthentication: boolean;
}
