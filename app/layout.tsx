import './globals.css';
import { Nunito } from 'next/font/google';
import { Providers } from './providers';
import { NextAuthProvider } from './provider';

const NunitoFont = Nunito({ subsets: ['latin'] });

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
      <body className={NunitoFont.className}>
        <NextAuthProvider>
          <Providers>{children}</Providers>
        </NextAuthProvider>
      </body>
    </html>
  );
}
