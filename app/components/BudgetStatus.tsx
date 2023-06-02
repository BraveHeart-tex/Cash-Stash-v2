'use client';
import React, { useEffect } from 'react';
import { Box, Text, Progress, useColorMode } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchBudgets } from '../redux/features/budgetSlice';

const BudgetStatus = () => {
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const { budgets, isLoading } = useAppSelector((state) => state.budgetReducer);

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  // const budgets = [
  //   { category: 'Food', budget: 500, spent: 350 },
  //   { category: 'Transportation', budget: 200, spent: 150 },
  //   { category: 'Entertainment', budget: 300, spent: 100 },
  //   { category: 'Utilities', budget: 250, spent: 200 },
  // ];

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  if (!budgets || budgets.length === 0) {
    return <Box>No budgets found</Box>;
  }

  return (
    <Box>
      {budgets.map((budget) => (
        <Box
          key={budget.category}
          mb={4}
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          rounded={'md'}
          p={2}
          shadow={'xl'}
        >
          <Text fontWeight='bold' mb={2}>
            {budget.category}
          </Text>
          <Progress
            value={(budget.spentAmount / budget.budgetAmount) * 100}
            colorScheme={
              budget.spentAmount / budget.budgetAmount > 0.7
                ? 'red'
                : budget.spentAmount / budget.budgetAmount > 0.4
                ? 'orange'
                : 'green'
            }
            size='sm'
          />
          <Text mt={2} fontSize='sm'>
            Spent: ${budget.spentAmount} / Budget: ${budget.budgetAmount}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export default BudgetStatus;
