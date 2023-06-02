'use client';
import { Box, Text, Stack, Badge, useColorMode } from '@chakra-ui/react';
import { Transaction } from '@prisma/client';

interface ITransactionHistoryProps {
  transactions: Transaction[] | null;
}

const TransactionHistory = ({ transactions }: ITransactionHistoryProps) => {
  const { colorMode } = useColorMode();

  if (!transactions || transactions.length === 0) {
    return <Box>No transactions found.</Box>;
  }

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
                colorScheme={transaction.isIncome ? 'green' : 'red'}
              >
                {transaction.isIncome ? 'Income' : 'Expense'}
              </Badge>
            </Text>

            <Text>
              {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Text>{transaction.amount}₺</Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default TransactionHistory;
