'use client';
import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import Navigation from '../components/Navigation';
import GoalCard from '../components/GoalsPage/GoalCard';
import CreateUserGoalModal from '../components/GoalsPage/modals/CreateGoalModal';
import { useEffect } from 'react';
import { fetchGoals } from '../redux/features/goalSlice';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setCreateGoalModalOpen } from '../redux/features/goalSlice';

const GoalsPageClient = () => {
  const { colorMode } = useColorMode();
  const { goals, isLoading } = useAppSelector((state) => state.goalReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  if ((!isLoading && !goals) || goals?.length === 0) {
    return (
      <Container maxW={'8xl'} p={4}>
        <Navigation />
        <Heading>Goals</Heading>
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
            No goals were found.
          </Heading>
          <Text>Add a goal to get started!</Text>
          <Button
            bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
            _hover={{
              bg: colorMode === 'light' ? 'gray.300' : 'gray.600',
            }}
            color={colorMode === 'light' ? 'gray.800' : 'gray.50'}
            onClick={() => dispatch(setCreateGoalModalOpen(true))}
          >
            Create Goal
          </Button>
        </Box>
        <CreateUserGoalModal />
      </Container>
    );
  }

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
        {isLoading ? (
          <Box
            height={'50vh'}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={4}
          >
            <Text>Loading goals... </Text>
            <Spinner />
          </Box>
        ) : (
          <Box width={'100%'}>
            <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap={4} mt={4}>
              <GoalCard goals={goals} />
            </SimpleGrid>
          </Box>
        )}
        <Button
          mt={4}
          onClick={() => dispatch(setCreateGoalModalOpen(true))}
          bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          _hover={{
            bg: colorMode === 'light' ? 'gray.300' : 'gray.600',
          }}
          color={colorMode === 'light' ? 'gray.800' : 'gray.50'}
        >
          Create Goal
        </Button>
      </Box>
      <CreateUserGoalModal />
    </Container>
  );
};

export default GoalsPageClient;
