'use client';
import Navigation from '../components/Navigation';
import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Spinner,
  useColorMode,
  Text,
} from '@chakra-ui/react';
import BudgetCards from '../components/BudgetsPage/BudgetCards';
import CreateBudgetModal from '../components/BudgetsPage/modals/CreateBudgetModal';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect } from 'react';
import { fetchBudgets } from '../redux/features/budgetSlice';
import { setCreateBudgetModalOpen } from '../redux/features/budgetSlice';

const BudgetsPageClient = () => {
  const { budgets, isLoading } = useAppSelector((state) => state.budgetReducer);
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  if (!isLoading && !budgets) {
    return (
      <Container maxW={'8xl'} p={4}>
        <Navigation />
        <Heading as='h1' mb={4}>
          Budgets
        </Heading>
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          flexDirection={'column'}
          gap={4}
        >
          <Heading
            display='inline-block'
            as='h2'
            size='2xl'
            bgGradient={
              colorMode === 'light'
                ? 'linear(to-r, gray.600, gray.800)'
                : 'linear(to-r, gray.200, gray.400)'
            }
            backgroundClip='text'
          >
            No budgets were found.
          </Heading>
          <Text>Add a budget to get started!</Text>
          <Button
            bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
            _hover={{
              bg: colorMode === 'light' ? 'gray.300' : 'gray.600',
            }}
            color={colorMode === 'light' ? 'gray.800' : 'gray.50'}
            onClick={() => dispatch(setCreateBudgetModalOpen(true))}
          >
            Create Budget
          </Button>
        </Box>
        <CreateBudgetModal />
      </Container>
    );
  }

  return (
    <Container maxW={'8xl'} p={4}>
      <Navigation />
      <Heading as='h1' mb={4}>
        Budgets
      </Heading>
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        flexDirection={'column'}
        gap={4}
      >
        {budgets && budgets.length === 0 && (
          <Box>
            <Text>No budgets found. Add a budget to get started!</Text>
          </Box>
        )}
        {isLoading ? (
          <Box
            height={'50vh'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            flexDirection={'column'}
            gap={4}
          >
            <Text>Loading budgets...</Text>
            <Spinner />
          </Box>
        ) : (
          <Box width={'100%'}>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
              <BudgetCards budgets={budgets} />
            </SimpleGrid>
          </Box>
        )}
        <Button
          bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          _hover={{
            bg: colorMode === 'light' ? 'gray.300' : 'gray.600',
          }}
          color={colorMode === 'light' ? 'gray.800' : 'gray.50'}
          onClick={() => dispatch(setCreateBudgetModalOpen(true))}
        >
          Create Budget
        </Button>
      </Box>
      <CreateBudgetModal />
    </Container>
  );
};

export default BudgetsPageClient;
