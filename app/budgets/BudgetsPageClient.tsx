'use client';
import Navigation from '../components/Navigation';
import { Container, Heading, SimpleGrid } from '@chakra-ui/react';
import { Budget } from '@prisma/client';
import BudgetCard from '../components/BudgetCard';

interface IBudgetsPageClientProps {}

const BudgetsPageClient = ({}: IBudgetsPageClientProps) => {
  const budgets: Budget[] = [
    {
      id: '1',
      category: 'FOOD',
      budgetAmount: 500,
      spentAmount: 350,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      category: 'SHOPPING',
      budgetAmount: 200,
      spentAmount: 150,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  return (
    <Container maxW={'8xl'} p={4}>
      <Navigation />
      <Heading as='h1' mb={4}>
        Budgets
      </Heading>
      {/* TODO: handle the case where budgets.length = 0 */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
        {budgets.map((budget) => (
          <BudgetCard budget={budget} key={budget.id} />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default BudgetsPageClient;
