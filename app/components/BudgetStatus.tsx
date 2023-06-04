'use client';
import React, { useEffect } from 'react';
import {
  Box,
  Text,
  Progress,
  useColorMode,
  Button,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchBudgets } from '../redux/features/budgetSlice';
import { Link } from '@chakra-ui/next-js';

const BudgetStatus = () => {
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const { budgets, isLoading } = useAppSelector((state) => state.budgetReducer);

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Flex gap={4}>
        <Text>Loading budgets...</Text>
        <Spinner />
      </Flex>
    );
  }

  if (!budgets || budgets.length === 0) {
    return (
      <Box>
        <Text color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
          No budgets found.
        </Text>
        <Link href={'/budgets'}>
          <Button mt={3}>Get started by creating a budget</Button>
        </Link>
      </Box>
    );
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
            {budget.category.charAt(0).toUpperCase() +
              budget.category.toLowerCase().slice(1)}
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
            Spent: {budget.spentAmount}₺ / Budget: {budget.budgetAmount}₺
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export default BudgetStatus;
