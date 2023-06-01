'use client';
import {
  Container,
  Heading,
  SimpleGrid,
  Box,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import Navigation from '../components/Navigation';
import TransactionsFilter from '@/app/components/TransactionsPage/TransactionsFilter';
import TransactionsSort from '../components/TransactionsPage/TransactionsSort';
import TransactionList from '../components/TransactionsPage/TransactionList';

const TransactionsClient = () => {
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
          <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }}>
            <TransactionList />
          </SimpleGrid>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default TransactionsClient;
