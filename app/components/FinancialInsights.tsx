'use client';
import React from 'react';
import {
  Box,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorMode,
} from '@chakra-ui/react';

const FinancialInsights = () => {
  const { colorMode } = useColorMode();
  const totalIncome = 5000;
  const totalExpenses = 2500;
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = (netIncome / totalIncome) * 100;

  return (
    <Box>
      <Stat mb={4}>
        <StatLabel>Total Income</StatLabel>
        <StatNumber>${totalIncome}</StatNumber>
      </Stat>
      <Stat mb={4}>
        <StatLabel>Total Expenses</StatLabel>
        <StatNumber>${totalExpenses}</StatNumber>
      </Stat>
      <Stat mb={4}>
        <StatLabel>Net Income</StatLabel>
        <StatNumber>${netIncome}</StatNumber>
      </Stat>
      <Stat mb={4}>
        <StatLabel>Savings Rate</StatLabel>
        <StatNumber>{savingsRate.toFixed(2)}%</StatNumber>
        <StatHelpText>Percentage of income saved</StatHelpText>
      </Stat>
    </Box>
  );
};

export default FinancialInsights;
