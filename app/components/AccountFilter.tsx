import React, { useState } from 'react';
import { Select, Box, List, ListItem, Heading, Flex } from '@chakra-ui/react';
import { UserAccount } from '@prisma/client';
import CreateUserAccountOptions from '../utils/CreateUserAccountOptions';
import AccountInformation from './AccountInformation';

interface IAccountFilterProps {
  accounts: UserAccount[] | null | undefined;
}

const AccountsFilter = ({ accounts }: IAccountFilterProps) => {
  const [selectedAccountType, setSelectedAccountType] = useState('');

  if (accounts?.length === 0 || !accounts) {
    return null;
  }

  const filteredAccounts = accounts.filter((account) =>
    selectedAccountType ? account.category === selectedAccountType : true
  );

  const handleAccountTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedAccountType(event.target.value);
  };

  return (
    <Box>
      <Flex justifyContent={'center'} alignItems={'center'}>
        <Select
          value={selectedAccountType}
          onChange={handleAccountTypeChange}
          mb={4}
          width={'13rem'}
        >
          <option value=''>All Accounts</option>
          {Object.entries(CreateUserAccountOptions).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </Select>
      </Flex>
      <AccountInformation userAccounts={filteredAccounts} />
    </Box>
  );
};

export default AccountsFilter;
