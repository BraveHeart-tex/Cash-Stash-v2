'use client';
import Navigation from '../components/Navigation';
import { Container, Heading, SimpleGrid } from '@chakra-ui/react';
import BudgetCards from '../components/BudgetCards';

interface IBudgetsPageClientProps {}

const BudgetsPageClient = ({}: IBudgetsPageClientProps) => {
  return (
    <Container maxW={'8xl'} p={4}>
      <Navigation />
      <Heading as='h1' mb={4}>
        Budgets
      </Heading>
      {/* TODO: handle the case where budgets.length = 0 */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
        <BudgetCards />
      </SimpleGrid>
    </Container>
  );
};

export default BudgetsPageClient;
