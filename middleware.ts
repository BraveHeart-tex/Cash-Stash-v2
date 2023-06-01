export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/',
    '/budgets',
    '/accounts',
    '/transactions',
    '/goals',
    '/reports',
  ],
};
