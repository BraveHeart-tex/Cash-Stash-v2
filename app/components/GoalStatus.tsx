'use client';
import React from 'react';
import { Box, Text, Progress, useColorMode } from '@chakra-ui/react';

const GoalStatus = () => {
  const { colorMode } = useColorMode();

  const goals = [
    { name: 'Emergency Fund', target: 10000, current: 5000 },
    { name: 'Vacation Savings', target: 5000, current: 3000 },
    { name: 'Down Payment', target: 50000, current: 25000 },
  ];

  const progressBarColor = colorMode === 'dark' ? 'teal' : 'purple';
  const textColor = colorMode === 'dark' ? 'white' : 'black';

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
          <Text fontWeight='bold' mb={2} color={textColor}>
            {goal.name}
          </Text>
          <Progress
            value={(goal.current / goal.target) * 100}
            colorScheme={progressBarColor}
            size='sm'
          />
          <Text mt={2} fontSize='sm' color={textColor}>
            Current: ${goal.current} / Target: ${goal.target}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export default GoalStatus;
