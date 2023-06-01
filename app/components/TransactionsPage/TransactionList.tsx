'use client';
import { useEffect } from 'react';
import { fetchTransactions } from '@/app/redux/features/transactionsSlice';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import TransactionCard from './TransactionCard';
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';

const TransactionList = () => {
  const { data, filteredData, isLoading } = useAppSelector(
    (state) => state.transactionsReducer
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <Box>
      {isLoading && (
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          mt={4}
          gap={4}
        >
          <Text>Loading transactions...</Text>
          <Spinner />
        </Box>
      )}
      {filteredData?.length === 0 && (
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
      )}
      {filteredData
        ? filteredData?.map((transaction) => (
            <TransactionCard transaction={transaction} key={transaction.id} />
          ))
        : data?.map((transaction) => (
            <TransactionCard transaction={transaction} key={transaction.id} />
          ))}
    </Box>
  );
};

export default TransactionList;
