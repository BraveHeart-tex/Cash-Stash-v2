'use client';
import {
  Box,
  Heading,
  SimpleGrid,
  Container,
  Text,
  Spinner,
  useColorMode,
} from '@chakra-ui/react';
import Navigation from './Navigation';
import AccountSummaries from './AccountSummaries';
import BudgetStatus from './BudgetStatus';
import GoalStatus from './GoalStatus';
import TransactionHistory from './TransactionHistory';
import FinancialInsights from './FinancialInsights';
import NotificationsAndReminders from './NotificationAndReminders';
import InsightGroupChart from './DashboardPage/InsightGroupChart';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect } from 'react';
import {
  fetchInsightsData,
  fetchMonthlyTransactionsData,
  fetchTransactions,
} from '../redux/features/transactionsSlice';

const Dashboard = () => {
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    data: transactions,
    monthlyData,
    insightsData,
  } = useAppSelector((state) => state.transactionsReducer);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMonthlyTransactionsData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchInsightsData());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Container
        maxW={'8xl'}
        height={'100vh'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        flexDirection={'column'}
        gap={4}
      >
        <Heading>Loading...</Heading>
        <Box>
          <Spinner />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW={'8xl'} p={4}>
      <Navigation />
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4} mt={8}>
        <Box>
          <Heading size='md' mb={2}>
            Accounts Summary
          </Heading>
          <Box
            bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
            p={4}
            borderRadius='lg'
            boxShadow='sm'
          >
            {/* Render other account summaries */}
            <AccountSummaries />
          </Box>
        </Box>

        <Box>
          <Heading size='md' mb={2}>
            Budget Status
          </Heading>
          <Box
            bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
            p={4}
            borderRadius='lg'
            boxShadow='sm'
          >
            {/* Render budget status */}
            <BudgetStatus />
          </Box>
        </Box>

        <Box>
          <Heading size='md' mb={2}>
            Goal Progress
          </Heading>
          <Box
            bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
            p={4}
            borderRadius='lg'
            boxShadow='sm'
          >
            {/* Render goal progress */}
            <GoalStatus />
          </Box>
        </Box>

        <Box>
          <Heading size='md' mb={2}>
            Transaction History
          </Heading>
          <Box
            bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
            borderRadius='lg'
            boxShadow='sm'
          >
            {/* Render transaction history */}
            <TransactionHistory transactions={transactions} />
          </Box>
        </Box>

        <Box>
          <Heading size='md' mb={2}>
            Financial Insights
          </Heading>
          <Box
            bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
            p={4}
            borderRadius='lg'
            boxShadow='sm'
            rounded={'md'}
            shadow={'xl'}
          >
            {/* Render financial insights */}
            <Text
              fontWeight={'bold'}
              textDecoration={'underline'}
              color={colorMode === 'light' ? 'gray.700' : 'gray.50'}
            >
              Income vs Expense
            </Text>
            <InsightGroupChart monthlyData={monthlyData} />
            <FinancialInsights insightsData={insightsData} />
          </Box>
        </Box>

        <Box>
          <Heading size='md' mb={2}>
            Notifications and Reminders
          </Heading>
          <Box
            bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
            p={4}
            borderRadius='lg'
            boxShadow='sm'
          >
            {/* Render notifications and reminders */}
            <NotificationsAndReminders />
          </Box>
        </Box>
        <Box w={'100%'} height={'100%'}></Box>
      </SimpleGrid>
    </Container>
  );
};

export default Dashboard;
