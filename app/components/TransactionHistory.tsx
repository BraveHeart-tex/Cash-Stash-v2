'use client';
import { Link } from '@chakra-ui/next-js';
import {
  Box,
  Text,
  Stack,
  Badge,
  useColorMode,
  Button,
} from '@chakra-ui/react';
import { Transaction } from '@prisma/client';

interface ITransactionHistoryProps {
  transactions: Transaction[] | null;
}

const TransactionHistory = ({ transactions }: ITransactionHistoryProps) => {
  const { colorMode } = useColorMode();

  if (!transactions || transactions.length === 0) {
    return (
      <Box>
        <Text color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
          No transactions found.
        </Text>
        <Button mt={3}>
          <Link
            href={'/transactions'}
            _hover={{
              textDecoration: 'none',
            }}
          >
            Get started by creating a transaction.
          </Link>
        </Button>
      </Box>
    );
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
