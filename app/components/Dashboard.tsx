'use client';
import {
  Box,
  Heading,
  SimpleGrid,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';
import Navigation from './Navigation';
import Chart from './Chart';
import AccountSummaries from './AccountSummaries';
import BudgetStatus from './BudgetStatus';
import GoalStatus from './GoalStatus';
import TransactionHistory from './TransactionHistory';
import FinancialInsights from './FinancialInsights';
import NotificationsAndReminders from './NotificationAndReminders';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';

interface IDashboardProps {
  user: User | null;
}

const Dashboard = ({ user }: IDashboardProps) => {
  const router = useRouter();

  if (!user) {
    router.push('/login');
  }

  return (
    <Container maxW={'8xl'} p={4}>
      <Navigation user={user} />
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4} mt={8}>
        <Box>
          <Heading size='md' mb={2}>
            Accounts Summary {user?.name}
          </Heading>
          <Box
            bg={useColorModeValue('gray.50', 'gray.700')}
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
            bg={useColorModeValue('gray.50', 'gray.700')}
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
            bg={useColorModeValue('gray.50', 'gray.700')}
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
            bg={useColorModeValue('gray.50', 'gray.700')}
            borderRadius='lg'
            boxShadow='sm'
          >
            {/* Render transaction history */}
            <TransactionHistory />
          </Box>
        </Box>

        <Box>
          <Heading size='md' mb={2}>
            Financial Insights
          </Heading>
          <Box
            bg={useColorModeValue('white', 'gray.700')}
            p={4}
            borderRadius='lg'
            boxShadow='sm'
            rounded={'md'}
            shadow={'xl'}
          >
            <Chart />
            {/* Render financial insights */}
            <FinancialInsights />
          </Box>
        </Box>

        <Box>
          <Heading size='md' mb={2}>
            Notifications and Reminders
          </Heading>
          <Box
            bg={useColorModeValue('gray.50', 'gray.700')}
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
