'use client';
import {
  updateFilteredData,
  setSortBy,
  setSortDirection,
} from '@/app/redux/features/transactionsSlice';
import { useAppDispatch } from '@/app/redux/hooks';
import { Box, Stack, Select, Heading, useColorMode } from '@chakra-ui/react';
import React, { useEffect } from 'react';

interface ITransactionsSortProps {}

const TransactionsSort = ({}: ITransactionsSortProps) => {
  const dispatch = useAppDispatch();

  const { colorMode } = useColorMode();

  useEffect(() => {
    dispatch(setSortBy(''));
    dispatch(setSortDirection(''));
  }, [dispatch]);

  const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortBy(event.target.value as 'amount' | 'date'));
    dispatch(updateFilteredData());
  };

  const handleSortDirectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(setSortDirection(event.target.value as 'asc' | 'desc'));
    dispatch(updateFilteredData());
  };

  return (
    <Box
      p={4}
      width={{
        base: '100%',
        lg: '75%',
      }}
      mt={4}
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
      borderWidth={1}
      borderRadius={4}
      boxShadow={'md'}
    >
      <Heading as={'h2'} fontSize={'xl'} mb={4}>
        Sort
      </Heading>
      <Stack>
        <Select defaultValue={''} onChange={handleSortByChange}>
          <option value=''>None</option>
          <option value='amount'>Amount</option>
          <option value='date'>Date</option>
        </Select>
        <Select defaultValue={''} onChange={handleSortDirectionChange}>
          <option value='asc'>Ascending</option>
          <option value='desc'>Descending</option>
        </Select>
      </Stack>
    </Box>
  );
};

export default TransactionsSort;
