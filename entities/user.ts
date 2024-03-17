export interface User {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  emailVerified: number;
  createdAt: string;
  updatedAt: string;
  prefersTwoFactorAuthentication: number;
}
