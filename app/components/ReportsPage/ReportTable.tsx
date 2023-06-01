import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  Box,
  Flex,
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
import Chart from '../Chart';

const ReportTable = () => {
  const dispatch = useAppDispatch();
  const {
    data,
    filteredData: transactions,
    isLoading,
  } = useAppSelector((state) => state.transactionsReducer);
  const { currentUserAccounts } = useAppSelector(
    (state) => state.userAccountReducer
  );

  useEffect(() => {
    dispatch(fetchCurrentUserAccounts());
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
      {transactions && (
        <Box
          width={'100%'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          mt={9}
        >
          <Chart
            datasetToBeCompared={
              transactions &&
              transactions?.filter(
                (transaction) => transaction.isIncome === true
              )
            }
            datasetToCompare={
              transactions &&
              transactions?.filter(
                (transaction) => transaction.isIncome === false
              )
            }
          />
        </Box>
      )}
    </Box>
  );
};

export default ReportTable;
