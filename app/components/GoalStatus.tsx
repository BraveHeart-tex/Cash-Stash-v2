'use client';
import React, { useEffect } from 'react';
import {
  Box,
  Text,
  Progress,
  useColorMode,
  Badge,
  Button,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchGoals } from '../redux/features/goalSlice';
import { Link } from '@chakra-ui/next-js';

const GoalStatus = () => {
  const dispatch = useAppDispatch();
  const { goals, isLoading } = useAppSelector((state) => state.goalReducer);
  const { colorMode } = useColorMode();

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  const progressBarColor = colorMode === 'dark' ? 'teal' : 'purple';
  const textColor = colorMode === 'dark' ? 'white' : 'black';

  if (!goals || goals.length === 0) {
    return (
      <Box>
        <Text color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
          No goals found.
        </Text>
        <Button mt={3}>
          <Link
            href={'/goals'}
            _hover={{
              textDecoration: 'none',
            }}
          >
            Get started by creating a goal
          </Link>
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {goals.map((goal) => (
        <Box
          key={goal.name}
          mb={4}
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          rounded={'md'}
          p={2}
          shadow={'xl'}
        >
          <Badge>
            {goal.currentAmount / goal.goalAmount >= 1
              ? 'Completed!'
              : `In Progress ${Math.round(
                  (goal.currentAmount / goal.goalAmount) * 100
                )}%`}
          </Badge>
          <Text fontWeight='bold' mb={2} color={textColor}>
            {goal.name}
          </Text>
          <Progress
            value={(goal.currentAmount / goal.goalAmount) * 100}
            colorScheme={progressBarColor}
            size='sm'
          />
          <Text mt={2} fontSize='sm' color={textColor}>
            Current: {goal.currentAmount}₺ / Target: {goal.goalAmount}₺
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export default GoalStatus;
