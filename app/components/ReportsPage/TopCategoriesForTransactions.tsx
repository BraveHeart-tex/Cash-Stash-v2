import React from 'react';
import { Box, Text, useColorMode } from '@chakra-ui/react';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory';

interface TopCategoryData {
  category: string;
  totalAmount: number;
  accountId: number;
  createdAt: string;
}

interface ITopCategoriesForTransactionsProps {
  data: TopCategoryData[] | null;
}

const TopCategoriesForTransactions = ({
  data,
}: ITopCategoriesForTransactionsProps) => {
  const { colorMode } = useColorMode();
  if (!data || data.length === 0) {
    return <Box>No data found to generate chart from.</Box>;
  }

  const topCategoriesForTransactions = data?.map((transaction) => {
    return {
      x:
        transaction.category.charAt(0).toUpperCase() +
        transaction.category.slice(1).toLowerCase(),
      y: transaction.totalAmount,
    };
  });

  return (
    <Box>
      <Text
        color={colorMode === 'light' ? 'gray.700' : 'white'}
        textDecoration={'underline'}
        textDecorationColor={colorMode === 'light' ? 'gray.700' : 'white'}
        fontWeight={'bold'}
      >
        Top categories by transaction amount
      </Text>
      <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
        <VictoryBar
          style={{
            data: { fill: '#c43a31' },
          }}
          data={topCategoriesForTransactions}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 },
          }}
        />
      </VictoryChart>
    </Box>
  );
};

export default TopCategoriesForTransactions;
