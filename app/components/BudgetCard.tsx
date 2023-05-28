'use client';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
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
} from '@chakra-ui/react';
import { Budget } from '@prisma/client';
import ActionsIcon from './ActionsIcon';

interface IBudgetCardProps {
  budget: Budget;
  key: string;
}

const BudgetCard = ({ budget }: IBudgetCardProps) => {
  // TODO: Implement these functions with budget ID
  // Create state for editing and deleting budgets => selectedBudgetId
  const handleEditBudget = () => {};

  const handleDeleteBudget = () => {};

  return (
    <Box
      key={budget.id}
      p={4}
      borderWidth={1}
      borderRadius='md'
      position={'relative'}
    >
      <Stat>
        <StatLabel>{budget.category}</StatLabel>
        <StatNumber>${budget.spentAmount}</StatNumber>
      </Stat>
      <Text mt={2}>
        Budget: ${budget.budgetAmount} (
        {Math.round((budget.spentAmount / budget.budgetAmount) * 100)}%)
      </Text>
      <Popover>
        <PopoverTrigger>
          <IconButton
            icon={<ActionsIcon />}
            aria-label='account actions'
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
            Account Actions
          </PopoverHeader>
          <PopoverBody>
            <Flex justifyContent={'center'} alignItems={'center'}>
              <SimpleGrid columns={1} gap={4}>
                <Flex justifyContent={'center'} alignItems={'center'}>
                  <IconButton
                    aria-label={'Edit user account'}
                    onClick={() => handleEditBudget()}
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
                    onClick={() => handleDeleteBudget()}
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
  );
};

export default BudgetCard;
