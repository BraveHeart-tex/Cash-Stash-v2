'use client';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
  useColorMode,
  Spinner,
} from '@chakra-ui/react';
import ActionsIcon from './ActionsIcon';
import useColorModeStyles from '../hooks/useColorModeStyles';
import DeleteGoalModal from './DeleteGoalModal';
import EditGoalModal from './EditGoalModal';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchGoals } from '../redux/features/goalSlice';

const GoalCard = () => {
  const { goals, isLoading } = useAppSelector((state) => state.goalReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const [selectedGoalId, setSelectedGoalId] = useState('');

  const { colorMode } = useColorMode();
  const { headingColor } = useColorModeStyles();

  const deleteModal = useDisclosure();
  const editModal = useDisclosure();

  const handleEditGoal = (goalId: string) => {
    setSelectedGoalId(goalId);
    editModal.onOpen();
  };

  const handleDeleteGoal = (goalId: string) => {
    setSelectedGoalId(goalId);
    deleteModal.onOpen();
  };

  if (isLoading) {
    return (
      <Box
        display={'flex'}
        justifyContent={'start'}
        alignItems={'center'}
        gap={4}
      >
        <Text>Loading goals...</Text>
        <Spinner />
      </Box>
    );
  }

  return (
    <>
      {goals?.length === 0 && (
        <Box>
          <Text>No goals found. Add a goal to get started!</Text>
        </Box>
      )}
      {goals?.map((goal) => (
        <Box
          p={4}
          borderWidth={1}
          borderRadius='md'
          position={'relative'}
          borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          key={goal.id}
        >
          <Stat position={'relative'}>
            <StatLabel>{goal.name}</StatLabel>
            <StatNumber color={headingColor}>
              Goal: ${goal.goalAmount}
            </StatNumber>
            <Badge
              position={'absolute'}
              top={'50%'}
              right={1}
              mb={2}
              bg={
                (goal.currentAmount / goal.goalAmount) * 100 >= 100
                  ? 'green'
                  : 'blue.600'
              }
              color={'white'}
            >
              {((goal.currentAmount / goal.goalAmount) * 100).toFixed(0)}%
            </Badge>
          </Stat>
          <Text color={colorMode === 'light' ? 'gray.600' : 'gray.300'} mt={2}>
            Current Amount: ${goal.currentAmount}
          </Text>
          <Progress
            value={(goal.currentAmount / goal.goalAmount) * 100}
            mt={4}
            bg={colorMode === 'light' ? 'gray.300' : 'gray.600'}
            rounded={'md'}
            colorScheme={
              (goal.currentAmount / goal.goalAmount) * 100 >= 100
                ? 'green'
                : 'blue'
            }
          />
          <Text mt={2} fontWeight={300}>
            {goal.currentAmount / goal.goalAmount >= 1
              ? 'Congrats! You have reached your goal!'
              : "Goal in progress... You've reached " +
                `${((goal.currentAmount / goal.goalAmount) * 100).toFixed(
                  0
                )}%` +
                ' of your goal.'}
          </Text>
          <Popover>
            <PopoverTrigger>
              <IconButton
                icon={<ActionsIcon />}
                aria-label='Budger actions'
                bg={'transparent'}
                width={5}
                height={5}
                position={'absolute'}
                top={2}
                right={2}
                mb={2}
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader fontWeight={'bold'} textAlign={'center'}>
                Goal Actions
              </PopoverHeader>
              <PopoverBody>
                <Flex justifyContent={'center'} alignItems={'center'}>
                  <SimpleGrid columns={1} gap={4}>
                    <Flex justifyContent={'center'} alignItems={'center'}>
                      <IconButton
                        aria-label={'Edit user account'}
                        onClick={() => handleEditGoal(goal.id)}
                        icon={<EditIcon />}
                        width={5}
                        height={5}
                        bg={'transparent'}
                        mr={2}
                      />
                      <Text width={'50%'}>Edit </Text>
                    </Flex>
                    <Flex justifyContent={'center'} alignItems={'center'}>
                      <IconButton
                        aria-label={'Delete user account'}
                        onClick={() => handleDeleteGoal(goal.id)}
                        icon={<DeleteIcon />}
                        width={5}
                        height={5}
                        bg={'transparent'}
                        mr={2}
                      />
                      <Text width={'50%'}>Delete </Text>
                    </Flex>
                  </SimpleGrid>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      ))}
      <DeleteGoalModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        selectedGoalId={selectedGoalId}
      />
      <EditGoalModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        selectedGoalId={selectedGoalId}
      />
    </>
  );
};

export default GoalCard;
