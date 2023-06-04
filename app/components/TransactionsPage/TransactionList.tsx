'use client';
import { useEffect } from 'react';
import { fetchTransactions } from '@/app/redux/features/transactionsSlice';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import TransactionCard from './TransactionCard';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';

const TransactionList = () => {
  const { data, filteredData, isLoading } = useAppSelector(
    (state) => state.transactionsReducer
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  if (!isLoading && data && data?.length === 0) {
    return (
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'flex-start'}
        flexDirection={'column'}
        gap={4}
        mt={{ base: 4, lg: 0 }}
      >
        <Heading fontSize={'2xl'}>No transactions found.</Heading>
        <Text>
          You can try again by removing any existing filters or creating a new
          transaction below.
        </Text>
      </Box>
    );
  }

  if (filteredData && filteredData.length === 0) {
    return (
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'flex-start'}
        flexDirection={'column'}
        gap={4}
        mt={{ base: 4, lg: 0 }}
      >
        <Heading fontSize={'2xl'}>No transactions found.</Heading>
        <Text>
          You can try again by removing any existing filters or creating a new
          transaction below.
        </Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap={4}>
      {filteredData && filteredData?.length > 0
        ? filteredData?.map((transaction) => (
            <TransactionCard transaction={transaction} key={transaction.id} />
          ))
        : data?.map((transaction) => (
            <TransactionCard transaction={transaction} key={transaction.id} />
          ))}
    </SimpleGrid>
  );
};

export default TransactionList;
