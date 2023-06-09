'use client';
import {
  setFilterType,
  setFilterAccount,
  updateFilteredData,
} from '../../redux/features/transactionsSlice';
import { Heading, Select, Stack, Text, useColorMode } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { Box } from '@chakra-ui/react';
import { fetchTransactions } from '../../redux/features/transactionsSlice';
import { fetchCurrentUserAccounts } from '@/app/redux/features/userAccountSlice';

const TransactionsFilter = () => {
  const dispatch = useAppDispatch();
  const { currentUserAccounts } = useAppSelector(
    (state) => state.userAccountReducer
  );

  useEffect(() => {
    dispatch(fetchCurrentUserAccounts());
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setFilterType(''));
    dispatch(setFilterAccount(''));
  }, [dispatch]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilterType(event.target.value));
    dispatch(updateFilteredData());
  };

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilterAccount(event.target.value));
    dispatch(updateFilteredData());
  };

  const { colorMode } = useColorMode();

  return (
    <Box
      minHeight={'10rem'}
      width={{
        base: '100%',
        lg: '75%',
      }}
      p={4}
      mt={4}
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
      borderWidth={1}
      borderRadius={4}
      boxShadow={'md'}
    >
      <Heading as={'h2'} fontSize={'xl'} mb={4}>
        Filter
      </Heading>
      <Stack direction='column' spacing={4}>
        <Box>
          <Text mb={2}>By Transaction Type</Text>
          <Select defaultValue={''} onChange={handleTypeChange}>
            <option value=''>All</option>
            <option value='income'>Income</option>
            <option value='expense'>Expense</option>
          </Select>
        </Box>
        <Box>
          <Text mb={2}>By Account</Text>
          <Select onChange={handleAccountChange} defaultValue={''}>
            <option value=''>All</option>
            {currentUserAccounts &&
              currentUserAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
          </Select>
        </Box>
      </Stack>
    </Box>
  );
};

export default TransactionsFilter;
