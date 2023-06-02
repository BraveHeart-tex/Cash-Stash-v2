import React from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { VictoryBar, VictoryChart, VictoryGroup } from 'victory';
import { MonthlyTransactionData } from '@/app/redux/features/transactionsSlice';

interface IInsightGroupChartProps {
  monthlyData: MonthlyTransactionData | null;
}

const InsightGroupChart = ({ monthlyData }: IInsightGroupChartProps) => {
  const { colorMode } = useColorMode();

  const labels = ['Income vs Expense'];

  if (!monthlyData) {
    return <Box>No data</Box>;
  }

  monthlyData.incomes.forEach((income) => {
    labels.push(income.month);
  });

  return (
    <Box>
      <VictoryChart>
        <VictoryGroup
          offset={35}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 },
          }}
          style={{
            data: {
              stroke: colorMode === 'light' ? '#343a40' : '#f1f3f5',
              strokeWidth: colorMode === 'light' ? 2 : 1,
            },

            labels: {
              fill: colorMode === 'light' ? 'black' : 'white',
            },
          }}
          colorScale={
            colorMode === 'light'
              ? ['#40c057', '#f03e3e']
              : ['#51cf66', '#fa5252']
          }
        >
          {/* Income */}
          <VictoryBar
            data={
              monthlyData.incomes.map((income) => ({
                x: income.month,
                y: income.amount,
              })) as any
            }
            categories={{
              x: monthlyData.incomes.map((income) => income.month),
            }}
            labels={['Income']}
            barWidth={({ index }) => (index === 0 ? 20 : 10)}
          />
          {/* Expense */}
          <VictoryBar
            data={
              monthlyData.expenses.map((expense) => ({
                x: expense.month,
                y: expense.amount,
              })) as any
            }
            categories={{
              x: monthlyData.expenses.map((expense) => expense.month),
            }}
            labels={['Expense']}
            barWidth={({ index }) => (index === 0 ? 20 : 10)}
            // put space between bars
          />
        </VictoryGroup>
      </VictoryChart>
    </Box>
  );
};

export default InsightGroupChart;
