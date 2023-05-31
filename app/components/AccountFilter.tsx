'use client';
import React, { useEffect, useState } from 'react';
import { Select, Box, Flex, Spinner, Text } from '@chakra-ui/react';
import CreateUserAccountOptions from '../utils/CreateUserAccountOptions';
import AccountInformation from './AccountInformation';
import { useAppSelector } from '../redux/hooks';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';
import { fetchCurrentUserAccounts } from '../redux/features/userAccountSlice';

const AccountsFilter = () => {
  const { currentUserAccounts: accounts, isLoading } = useAppSelector(
    (state) => state.userAccountReducer
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCurrentUserAccounts());
  }, [dispatch]);

  const [selectedAccountType, setSelectedAccountType] = useState('');

  if (isLoading) {
    return (
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={4}
      >
        <Text>Loading accounts... </Text>
        <Spinner />
      </Box>
    );
  }

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
