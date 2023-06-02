'use client';
import { Box, useColorMode, Text } from '@chakra-ui/react';
import { VictoryPie } from 'victory';

interface IPieChartProps {
  incomes: number[] | null;
  expenses: number[] | null;
}

const PieChart = ({ incomes, expenses }: IPieChartProps) => {
  const { colorMode } = useColorMode();

  // handle the null case
  const sampleNullData = [
    {
      x: 'No data',
      y: 10,
    },
    {
      x: 'No data',
      y: 5,
    },
  ];

  const incomeTotal = incomes
    ? incomes.reduce((a, b) => a + b, 0)
    : sampleNullData[0].y;
  const expenseTotal = expenses
    ? expenses.reduce((a, b) => a + b, 0)
    : sampleNullData[1].y;

  return (
    <Box>
      <Text
        color={colorMode === 'light' ? 'gray.700' : 'white'}
        textDecoration={'underline'}
        textDecorationColor={colorMode === 'light' ? 'gray.700' : 'white'}
        fontWeight={'bold'}
      >
        {incomes || expenses
          ? 'Income vs. Expense'
          : 'No data available for this time period'}
      </Text>
      <VictoryPie
        labels={
          incomes || expenses
            ? ({ datum }) => `${datum.x}: ${datum.y}`
            : ['No data', 'No data']
        }
        style={{
          labels: {
            fill: colorMode === 'light' ? 'black' : 'white',
          },
        }}
        colorScale={
          colorMode === 'light'
            ? ['#40c057', '#f03e3e']
            : ['#51cf66', '#ff6b6b']
        }
        data={[
          {
            x: incomes ? 'Income ₺' : sampleNullData[0].x,
            y: incomeTotal,
          },
          {
            x: expenses ? 'Expense ₺' : sampleNullData[1].x,
            y: expenseTotal,
          },
        ]}
        animate={{
          duration: 2000,
        }}
      />
    </Box>
  );
};

export default PieChart;
