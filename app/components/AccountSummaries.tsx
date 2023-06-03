'use client';
import React, { useEffect } from 'react';
import { Box, Text, SimpleGrid, useColorMode, Button } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCurrentUserAccounts } from '../redux/features/userAccountSlice';
import { Link } from '@chakra-ui/next-js';

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
    return (
      <Box>
        <Text color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
          No accounts found.
        </Text>
        <Button mt={3}>
          <Link
            href={'/accounts'}
            _hover={{
              textDecoration: 'none',
            }}
          >
            Get started by creating an account
          </Link>
        </Button>
      </Box>
    );
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
            <Text fontSize='lg'>Balance: {account.balance}₺</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default AccountSummaries;
