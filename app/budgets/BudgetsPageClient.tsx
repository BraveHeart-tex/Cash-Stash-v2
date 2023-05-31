'use client';
import Navigation from '../components/Navigation';
import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import BudgetCards from '../components/BudgetCards';
import CreateBudgetModal from '../components/CreateBudgetModal';

interface IBudgetsPageClientProps {}

const BudgetsPageClient = ({}: IBudgetsPageClientProps) => {
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
        <Box width={'100%'}>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
            <BudgetCards />
          </SimpleGrid>
        </Box>
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
