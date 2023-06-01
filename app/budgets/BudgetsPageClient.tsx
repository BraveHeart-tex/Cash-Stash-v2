'use client';
import Navigation from '../components/Navigation';
import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Spinner,
  useColorModeValue,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import BudgetCards from '../components/BudgetCards';
import CreateBudgetModal from '../components/CreateBudgetModal';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect } from 'react';
import { fetchBudgets } from '../redux/features/budgetSlice';

const BudgetsPageClient = () => {
  const { budgets, isLoading } = useAppSelector((state) => state.budgetReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  const { isOpen, onOpen, onClose } = useDisclosure();

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
        {budgets?.length === 0 && (
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
          bg={useColorModeValue('gray.200', 'gray.700')}
          _hover={{
            bg: useColorModeValue('gray.300', 'gray.600'),
          }}
          color={useColorModeValue('gray.800', 'gray.50')}
          onClick={onOpen}
        >
          Create Budget
        </Button>
      </Box>
      <CreateBudgetModal isOpen={isOpen} onClose={onClose} />
    </Container>
  );
};

export default BudgetsPageClient;
