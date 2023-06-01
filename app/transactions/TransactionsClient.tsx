'use client';
import { Container, Heading } from '@chakra-ui/react';
import Navigation from '../components/Navigation';

interface ITransactionsClientProps {}

const TransactionsClient = (props: ITransactionsClientProps) => {
  return (
    <Container maxW={'8xl'} p={4}>
      <Navigation />
      <Heading>Transactions</Heading>
      {/* Transactions List */}
      {/* Transactions filters by account */}
      {/* Transactions filters by categories */}
      {/* Transactions filters by date */}
      {/* Transactions filters by amount */}
    </Container>
  );
};

export default TransactionsClient;
