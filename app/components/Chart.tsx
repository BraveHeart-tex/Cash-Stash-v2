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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
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
        text: 'Budget vs Expenses',
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
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'November',
    'December',
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Budget',
        data: [165, 159, 180, 181, 156, 155, 140],
        backgroundColor: colorMode === 'dark' ? '#63b3ed' : '#3182ce',
      },
      {
        label: 'Expenses',
        data: [128, 148, 140, 119, 186, 127, 190],
        backgroundColor: colorMode === 'dark' ? '#f56565' : '#e53e3e',
      },
    ],
  };

  return <Bar data={data} options={options} />;
};

export default Chart;
