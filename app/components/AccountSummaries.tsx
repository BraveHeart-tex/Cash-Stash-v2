'use client';
import React from 'react';
import { Box, Text, SimpleGrid, useColorMode } from '@chakra-ui/react';

const AccountSummaries = () => {
  const { colorMode } = useColorMode();
  const accounts = [
    { name: 'Savings Account', balance: '$10,000' },
    { name: 'Checking Account', balance: '$5,000' },
    { name: 'Credit Card', balance: '$-2,500' },
    { name: 'Investment Account', balance: '$25,000' },
  ];

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
            <Text fontSize='lg'>{account.balance}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default AccountSummaries;
