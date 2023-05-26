import React from 'react';
import AccountsPageClient from './AccountPageClient';
import { Container } from '@chakra-ui/react';
import getCurrentUser from '../actions/getCurrentUser';

const AccountPage = async () => {
  const user = await getCurrentUser();
  return (
    <main>
      <AccountsPageClient user={user} />
    </main>
  );
};

export default AccountPage;
