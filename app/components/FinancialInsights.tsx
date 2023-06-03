'use client';
import React from 'react';
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  StatHelpText,
  Button,
  useColorMode,
  SimpleGrid,
} from '@chakra-ui/react';
import { InsightsData } from '../redux/features/transactionsSlice';
import { Link } from '@chakra-ui/next-js';

interface IFinancialInsightsProps {
  insightsData: InsightsData | null;
}

const FinancialInsights = ({ insightsData }: IFinancialInsightsProps) => {
  const { colorMode } = useColorMode();
  if (!insightsData) {
    return (
      <Box my={3}>
        <SimpleGrid
          columns={1}
          gap={4}
          color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
        >
          <Text>No data was found to generate financial insights from.</Text>
          <Text>
            Please make sure you have transactions to generate the necessary
            data.
          </Text>
        </SimpleGrid>
        <Button mt={3}>
          <Link
            href={'/transactions'}
            _hover={{
              textDecoration: 'none',
            }}
          >
            Transactions
          </Link>
        </Button>
      </Box>
    );
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
