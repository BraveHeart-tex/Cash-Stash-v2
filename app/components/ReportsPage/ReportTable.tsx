import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  Box,
  Heading,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { fetchTransactions } from '@/app/redux/features/transactionsSlice';
import { fetchCurrentUserAccounts } from '@/app/redux/features/userAccountSlice';
import { useEffect } from 'react';
import TransactionsFilter from '../TransactionsPage/TransactionsFilter';
import TransactionsSort from '../TransactionsPage/TransactionsSort';
import PieChart from '@/app/PieChart';
import TopCategoriesForTransactions from './TopCategoriesForTransactions';
import { fetchTopTransactionsByCategory } from '@/app/redux/features/transactionsSlice';

const ReportTable = () => {
  const dispatch = useAppDispatch();
  const {
    // data,
    filteredData: transactions,
    isLoading,
    topTransactionsByCategory,
  } = useAppSelector((state) => state.transactionsReducer);
  const { currentUserAccounts } = useAppSelector(
    (state) => state.userAccountReducer
  );

  useEffect(() => {
    dispatch(fetchCurrentUserAccounts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTopTransactionsByCategory());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <Box>
      <Heading size='md' my={4}>
        Transaction History Report
      </Heading>

      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        gap={{
          base: 8,
          lg: 4,
        }}
      >
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          flexDirection={'column'}
        >
          <TransactionsFilter />
          <TransactionsSort />
        </Box>
        <Table
          colorScheme={'blackAlpha'}
          size={{
            base: 'sm',
            md: 'md',
          }}
        >
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Account</Th>
              <Th>Description</Th>
              <Th>Category</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions?.length === 0 && !isLoading && (
              <Tr>
                <Td colSpan={5}>
                  No transactions found. You can try again by removing any
                  existing filters...
                </Td>
              </Tr>
            )}
            {transactions &&
              !isLoading &&
              transactions.map((transaction) => (
                <Tr key={transaction.id}>
                  <Td>
                    {new Date(transaction.createdAt).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </Td>
                  <Td>
                    {transaction.isIncome ? '+' : '-'}
                    {transaction.amount}₺
                  </Td>
                  <Td>
                    {currentUserAccounts &&
                      currentUserAccounts.find(
                        (account) => account.id === transaction.accountId
                      )?.name}
                  </Td>
                  <Td>{transaction.description}</Td>
                  <Td>{transaction.category}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, lg: 2 }}>
        <Box
          display={'flex'}
          justifyContent={'flex-start'}
          alignItems={'center'}
          h={'100%'}
          mt={{
            base: 8,
            lg: 6,
          }}
          pl={{
            base: 0,
            lg: 24,
          }}
        >
          <PieChart
            incomes={
              transactions &&
              transactions.map((transaction) =>
                transaction.isIncome ? transaction.amount : 0
              )
            }
            expenses={
              transactions &&
              transactions.map((transaction) =>
                transaction.isIncome ? 0 : transaction.amount
              )
            }
          />
        </Box>
        <Box
          display={'flex'}
          justifyContent={'flex-start'}
          alignItems={'center'}
          width={'25rem'}
          h={'100%'}
        >
          <TopCategoriesForTransactions
            data={topTransactionsByCategory && topTransactionsByCategory}
          />
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default ReportTable;
