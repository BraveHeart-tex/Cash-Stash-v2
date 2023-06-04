'use client';
import {
  SimpleGrid,
  Stat,
  Box,
  Text,
  StatLabel,
  StatNumber,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Flex,
  Progress,
  useColorMode,
  Badge,
} from '@chakra-ui/react';
import ActionsIcon from '../Icons/ActionsIcon';
import EditIcon from '../Icons/EditIcon';
import DeleteIcon from '../Icons/DeleteIcon';
import EditBudgetModal from './modals/EditBudgetModal';
import DeleteBudgetModal from './modals/DeleteBudgetModal';
import useColorModeStyles from '../../hooks/useColorModeStyles';
import { Budget } from '@prisma/client';
import { useAppDispatch } from '@/app/redux/hooks';
import {
  setDeleteBudgetModalOpen,
  setEditBudgetModalOpen,
} from '@/app/redux/features/budgetSlice';

interface IBudgetCardsProps {
  budgets: Budget[] | null;
}

const BudgetCards = ({ budgets }: IBudgetCardsProps) => {
  const dispatch = useAppDispatch();
  const { textColor, headingColor } = useColorModeStyles();
  const { colorMode } = useColorMode();

  return (
    <>
      {budgets &&
        budgets.map((budget) => (
          <Box
            key={budget.id}
            p={4}
            borderWidth={1}
            borderRadius='md'
            position={'relative'}
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          >
            <Stat position={'relative'}>
              <StatLabel>{budget.category}</StatLabel>
              <StatNumber color={headingColor}>
                Spent: ${budget.spentAmount}
              </StatNumber>
              <Badge
                color={
                  budget.spentAmount / budget.budgetAmount > 0.5
                    ? 'red'
                    : 'green'
                }
                bg={
                  budget.spentAmount / budget.budgetAmount > 0.5
                    ? 'red.200'
                    : 'green.200'
                }
                position={'absolute'}
                top={'50%'}
                right={1}
                mb={2}
              >
                {((budget.spentAmount / budget.budgetAmount) * 100).toFixed(0)}%
              </Badge>
            </Stat>
            <Text mt={2}>Budget: ${budget.budgetAmount}</Text>
            <Progress
              value={(budget.spentAmount / budget.budgetAmount) * 100}
              mt={4}
              colorScheme={
                budget.spentAmount / budget.budgetAmount > 0.7
                  ? 'red'
                  : budget.spentAmount / budget.budgetAmount > 0.4
                  ? 'orange'
                  : 'green'
              }
              bg={colorMode === 'light' ? 'gray.300' : 'gray.600'}
              rounded={'md'}
            />
            <Text color={textColor} mt={3} fontWeight={'300'}>
              {budget.spentAmount / budget.budgetAmount > 1
                ? 'You are over budget!'
                : budget.spentAmount / budget.budgetAmount > 0.7
                ? 'You are almost over budget!'
                : budget.spentAmount / budget.budgetAmount > 0.4
                ? 'You are halfway to your budget!'
                : 'You are under budget!'}
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
                  Budget Actions
                </PopoverHeader>
                <PopoverBody>
                  <Flex justifyContent={'center'} alignItems={'center'}>
                    <SimpleGrid columns={1} gap={4}>
                      <Flex justifyContent={'center'} alignItems={'center'}>
                        <IconButton
                          aria-label={'Edit user account'}
                          onClick={() =>
                            dispatch(
                              setEditBudgetModalOpen({
                                isEditBudgetModalOpen: true,
                                selectedBudgetId: budget.id,
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
                          aria-label={'Delete user account'}
                          onClick={() =>
                            dispatch(
                              setDeleteBudgetModalOpen({
                                isDeleteBudgetModalOpen: true,
                                selectedBudgetId: budget.id,
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
      <EditBudgetModal />
      <DeleteBudgetModal />
    </>
  );
};

export default BudgetCards;
