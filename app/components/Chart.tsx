'use client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useColorMode } from '@chakra-ui/react';
import { Budget, Goal, Transaction } from '@prisma/client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface IChartProps<T extends Budget | Goal | Transaction> {
  datasetToBeCompared: Array<T> | null;
  datasetToCompare: Array<T> | null;
}

const Chart = ({
  datasetToBeCompared,
  datasetToCompare,
}: IChartProps<Budget | Goal | Transaction>) => {
  const { colorMode } = useColorMode();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: colorMode === 'dark' ? 'white' : 'black',
        },
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Income vs Expenses',
        color: colorMode === 'dark' ? 'white' : 'black',
      },
    },
    scales: {
      y: {
        ticks: {
          color: colorMode === 'dark' ? 'white' : 'black',
          beginAtZero: true,
        },
      },
      x: {
        ticks: {
          color: colorMode === 'dark' ? 'white' : 'black',
          beginAtZero: true,
        },
      },
    },
  };

  const labels = [
    datasetToBeCompared?.map((item) =>
      new Date(item.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    ) || [],
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        // if datasetToBeCompared is of type Budget, then map over it and return the amount
        // if datasetToBeCompared is of type Goal, then map over it and return the amount
        // if datasetToBeCompared is of type Transaction, then map over it and return the amount
        // @ts-ignore
        data: datasetToBeCompared?.map((item) => item.amount) || [],
        backgroundColor: colorMode === 'dark' ? '#63b3ed' : '#3182ce',
      },
      {
        label: 'Expenses',
        // if datasetToBeCompare is of type Budget, then map over it and return the amount
        // if datasetToBeCompare is of type Goal, then map over it and return the amount
        // if datasetToBeCompare is of type Transaction, then map over it and return the amount
        // @ts-ignore
        data: datasetToCompare?.map((item) => item.amount) || [],
        backgroundColor: colorMode === 'dark' ? '#f56565' : '#e53e3e',
      },
    ],
  };

  return <Bar data={data} options={options} />;
};

export default Chart;
