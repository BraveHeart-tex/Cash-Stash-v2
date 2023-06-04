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
  useColorMode,
} from '@chakra-ui/react';
import ActionsIcon from '../Icons/ActionsIcon';
import useColorModeStyles from '../../hooks/useColorModeStyles';
import DeleteGoalModal from './modals/DeleteGoalModal';
import EditGoalModal from './modals/EditGoalModal';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  setCreateGoalModalOpen,
  setDeleteGoalModalOpen,
  setEditGoalModalOpen,
} from '@/app/redux/features/goalSlice';

import { Goal } from '@prisma/client';

interface IGoalCardProps {
  goals: Goal[] | null;
}

const GoalCard = ({ goals }: IGoalCardProps) => {
  const dispatch = useAppDispatch();
  const { isEditGoalModalOpen, isCreateGoalModalOpen } = useAppSelector(
    (state) => state.goalReducer
  );
  const { colorMode } = useColorMode();
  const { headingColor } = useColorModeStyles();

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
                        aria-label={'Edit user goal'}
                        onClick={() =>
                          dispatch(
                            setEditGoalModalOpen({
                              isEditGoalModalOpen: true,
                              selectedGoalId: goal.id,
                            })
                          )
                        }
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
                        aria-label={'Delete user goal'}
                        onClick={() =>
                          dispatch(
                            setDeleteGoalModalOpen({
                              isDeleteGoalModalOpen: true,
                              selectedGoalId: goal.id,
                            })
                          )
                        }
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
      <DeleteGoalModal />
      <EditGoalModal />
    </>
  );
};

export default GoalCard;
