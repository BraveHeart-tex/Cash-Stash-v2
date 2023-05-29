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
  useDisclosure,
} from '@chakra-ui/react';
import { Budget } from '@prisma/client';
import ActionsIcon from './ActionsIcon';
import EditIcon from './EditIcon';
import DeleteIcon from './DeleteIcon';
import EditBudgetModal from './EditBudgetModal';
import DeleteBudgetModal from './DeleteBudgetModal';
import { useState } from 'react';

const BudgetCards = () => {
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const deleteModalOnClose = () => {
    setIsDeleteModalOpen(false);
  };

  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleEditBudget = (budgetId: string) => {
    setSelectedBudgetId(budgetId);
    onOpen();
  };

  const handleDeleteBudget = (budgetId: string) => {
    setSelectedBudgetId(budgetId);
    setIsDeleteModalOpen(true);
  };

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
    <>
      {budgets.map((budget) => (
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
                        onClick={() => handleEditBudget(budget.id)}
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
                        onClick={() => handleDeleteBudget(budget.id)}
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
          <EditBudgetModal
            isOpen={isOpen}
            onClose={onClose}
            selectedBudgetId={selectedBudgetId}
          />
          <DeleteBudgetModal
            isOpen={isDeleteModalOpen}
            onClose={deleteModalOnClose}
            selectedBudgetId={selectedBudgetId}
          />
        </Box>
      ))}
    </>
  );
};

export default BudgetCards;
