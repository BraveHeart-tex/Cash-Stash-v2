'use client';
import React, { useEffect } from 'react';
import { Box, Text, SimpleGrid, useColorMode } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCurrentUserAccounts } from '../redux/features/userAccountSlice';

const AccountSummaries = () => {
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const { currentUserAccounts: accounts, isLoading } = useAppSelector(
    (state) => state.userAccountReducer
  );

  useEffect(() => {
    dispatch(fetchCurrentUserAccounts());
  }, [dispatch]);

  if (isLoading) {
    <Box>Loading...</Box>;
  }

  if (!accounts || accounts.length === 0) {
    return <Box>No accounts found. Please add an account to get started.</Box>;
  }

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
        {accounts.map((account) => (
          <Box
            key={account.name}
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            p={4}
            borderRadius='md'
            boxShadow='lg'
          >
            <Text fontWeight='bold' mb={2}>
              {account.name}
            </Text>
            <Text fontSize='lg'>{account.balance}₺</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default AccountSummaries;
