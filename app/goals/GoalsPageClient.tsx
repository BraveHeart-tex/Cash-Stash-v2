'use client';
import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import Navigation from '../components/Navigation';
import GoalCard from '../components/GoalCard';
import CreateUserGoalModal from '../components/CreateUserGoalModal';

const GoalsPageClient = () => {
  const createGoalModal = useDisclosure();
  return (
    <Container maxW={'8xl'} p={4}>
      <Navigation />
      <Heading>Goals</Heading>
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        flexDirection={'column'}
      >
        <Box width={'100%'}>
          <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap={4} mt={4}>
            <GoalCard />
          </SimpleGrid>
        </Box>
        <Button
          mt={4}
          onClick={createGoalModal.onOpen}
          bg={useColorModeValue('gray.200', 'gray.700')}
          _hover={{
            bg: useColorModeValue('gray.300', 'gray.600'),
          }}
          color={useColorModeValue('gray.800', 'gray.50')}
        >
          Create Goal
        </Button>
      </Box>
      <CreateUserGoalModal
        isOpen={createGoalModal.isOpen}
        onClose={createGoalModal.onClose}
      />
    </Container>
  );
};

export default GoalsPageClient;
