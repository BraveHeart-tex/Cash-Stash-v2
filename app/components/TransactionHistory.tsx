'use client';
import React from 'react';
import { Box, Text, Stack, Badge, useColorMode } from '@chakra-ui/react';

const TransactionHistory = () => {
  const { colorMode } = useColorMode();
  const transactions = [
    { id: 1, date: '2022-01-15', description: 'Payment received', amount: 500 },
    {
      id: 2,
      date: '2022-02-05',
      description: 'Grocery shopping',
      amount: -100,
    },
    { id: 3, date: '2022-03-20', description: 'Restaurant bill', amount: -50 },
    { id: 4, date: '2022-04-10', description: 'Salary deposit', amount: 2000 },
  ];

  return (
    <Box p={2}>
      <Stack spacing={4}>
        {transactions.map((transaction) => (
          <Box
            key={transaction.id}
            p={4}
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            rounded={'md'}
            shadow={'xl'}
          >
            <Text fontWeight='bold' fontSize='lg'>
              {transaction.description}
              <Badge
                ml={2}
                colorScheme={transaction.amount > 0 ? 'green' : 'red'}
              >
                {transaction.amount > 0 ? 'Income' : 'Expense'}
              </Badge>
            </Text>

            <Text>{transaction.date}</Text>
            <Text>${transaction.amount}</Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default TransactionHistory;
