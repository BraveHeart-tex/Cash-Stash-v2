import getCurrentUser from '../actions/getCurrentUser';
import Navigation from '../components/Navigation';

export const metadata = {
  title: 'Cash Stash | Accounts',
  description:
    'Look at all your accounts in one place. Create new accounts and manage your existing ones.',
};

interface ILayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: ILayoutProps) {
  return <main>{children}</main>;
}
