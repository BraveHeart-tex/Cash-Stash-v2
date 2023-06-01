'use client';
import {
  Container,
  Heading,
  SimpleGrid,
  Box,
  Grid,
  GridItem,
  Button,
  useColorMode,
} from '@chakra-ui/react';
import Navigation from '../components/Navigation';
import TransactionsFilter from '@/app/components/TransactionsPage/TransactionsFilter';
import TransactionsSort from '../components/TransactionsPage/TransactionsSort';
import TransactionList from '../components/TransactionsPage/TransactionList';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setCreateModalOpen } from '../redux/features/transactionsSlice';
import CreateTransactionModal from '../components/TransactionsPage/modals/CreateTransactionModal';

const TransactionsClient = () => {
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const { createModalOpen } = useAppSelector(
    (state) => state.transactionsReducer
  );

  return (
    <Container maxW={'8xl'} p={4}>
      <Navigation />
      <Heading>Transactions</Heading>
      <Grid h='50vh' templateRows={'1fr'} templateColumns={'repeat(3,1fr)'}>
        <GridItem
          colSpan={{
            base: 3,
            lg: 1,
          }}
        >
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'flex-start'}
            gap={1}
            flexDirection={'column'}
          >
            <TransactionsFilter />
            <TransactionsSort />
            <Button
              mt={4}
              bg={colorMode === 'light' ? 'gray.300' : 'gray.700'}
              color={colorMode === 'light' ? 'gray.700' : 'gray.300'}
              onClick={() => dispatch(setCreateModalOpen(!createModalOpen))}
            >
              Create Transaction
            </Button>
          </Box>
        </GridItem>
        <GridItem
          colSpan={{
            base: 3,
            lg: 2,
          }}
        >
          <Heading display={{ base: 'block', lg: 'none' }} mt={4}>
            Transactions List
          </Heading>
          <Box>
            <TransactionList />
          </Box>
        </GridItem>
      </Grid>
      <CreateTransactionModal />
    </Container>
  );
};

export default TransactionsClient;
