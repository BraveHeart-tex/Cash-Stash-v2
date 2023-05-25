'use client';
import React from 'react';
import { Box, Text, Progress, useColorMode } from '@chakra-ui/react';

const BudgetStatus = () => {
  const { colorMode } = useColorMode();
  const budgets = [
    { category: 'Food', budget: 500, spent: 350 },
    { category: 'Transportation', budget: 200, spent: 150 },
    { category: 'Entertainment', budget: 300, spent: 100 },
    { category: 'Utilities', budget: 250, spent: 200 },
  ];

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
            value={(budget.spent / budget.budget) * 100}
            colorScheme={
              budget.spent / budget.budget > 0.7
                ? 'red'
                : budget.spent / budget.budget > 0.4
                ? 'orange'
                : 'green'
            }
            size='sm'
          />
          <Text mt={2} fontSize='sm'>
            Spent: ${budget.spent} / Budget: ${budget.budget}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export default BudgetStatus;
