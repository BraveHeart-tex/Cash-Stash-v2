import './globals.css';
import { Inter, JetBrains_Mono, Nunito, Roboto } from 'next/font/google';
import { Providers as ChakraUIProviders } from './providers';
import { Providers as ReduxProviders } from '@/app/redux/provider';
import { NextAuthProvider } from './provider';

const RobotoFont = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export const metadata = {
  title: 'Cash Stash | Personal Finance',
  description:
    'Minimalist personal finance app. Track your spending, set a budget, and save more.',
};

interface ILayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: ILayoutProps) {
  return (
    <html lang='en'>
      <body className={RobotoFont.className}>
        <NextAuthProvider>
          <ReduxProviders>
            <ChakraUIProviders>{children}</ChakraUIProviders>
          </ReduxProviders>
        </NextAuthProvider>
      </body>
    </html>
  );
}
