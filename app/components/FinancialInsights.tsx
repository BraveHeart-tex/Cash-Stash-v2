'use client';
import React from 'react';
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { InsightsData } from '../redux/features/transactionsSlice';

interface IFinancialInsightsProps {
  insightsData: InsightsData | null;
}

const FinancialInsights = ({ insightsData }: IFinancialInsightsProps) => {
  if (!insightsData) {
    return <Box>No data</Box>;
  }

  const { totalIncome, totalExpense, netIncome, savingsRate } = insightsData;

  return (
    <Box>
      <Stat mb={4}>
        <StatLabel>Total Income</StatLabel>
        <StatNumber>{totalIncome}₺</StatNumber>
      </Stat>
      <Stat mb={4}>
        <StatLabel>Total Expenses</StatLabel>
        <StatNumber>{totalExpense}₺</StatNumber>
      </Stat>
      <Stat mb={4}>
        <StatLabel>Net Income</StatLabel>
        <StatNumber>{netIncome}₺</StatNumber>
      </Stat>
      <Stat mb={4}>
        <StatLabel>Savings Rate</StatLabel>
        <StatNumber>{savingsRate}%</StatNumber>
        <StatHelpText
          color={parseInt(savingsRate) > 0 ? 'green.500' : 'red.500'}
          fontWeight={parseInt(savingsRate) > 0 ? 'bold' : 'bold'}
        >
          {parseInt(savingsRate) > 0
            ? 'You are saving more than you are spending!'
            : 'You are spending more than you are saving!'}
        </StatHelpText>
      </Stat>
    </Box>
  );
};

export default FinancialInsights;
