'use client';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Heading,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import useColorModeStyles from '../../../hooks/useColorModeStyles';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { fetchBudgets } from '../../../redux/features/budgetSlice';
import { setDeleteBudgetModalOpen } from '../../../redux/features/budgetSlice';

const DeleteBudgetModal = () => {
  const dispatch = useAppDispatch();
  const { selectedBudgetId, isDeleteBudgetModalOpen } = useAppSelector(
    (state) => state.budgetReducer
  );

  const { headingColor } = useColorModeStyles();
  const toast = useToast();

  const {
    handleSubmit,
    formState: { isLoading, isSubmitting },
  } = useForm();

  const onSubmit = async (id: number) => {
    try {
      await axios.delete(`/api/user/budgets/${id}`);
      dispatch(fetchBudgets());
      toast({
        title: 'Budget deleted.',
        description: 'The budget has been deleted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      dispatch(setDeleteBudgetModalOpen(false));
    } catch (error) {
      toast({
        title: 'An error occurred.',
        description: 'Unable to delete budget. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <Modal
      isOpen={isDeleteBudgetModalOpen}
      onClose={() => dispatch(setDeleteBudgetModalOpen(false))}
      isCentered
    >
      <ModalOverlay bg={'rgba(0, 0, 0, 0.25)'} />
      <ModalContent>
        <ModalHeader color={headingColor}>Delete Budget:</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            justifyContent={'center'}
            alignItems={'center'}
            flexDirection={'column'}
            gap={4}
          >
            <Heading as={'h1'} fontSize={'xl'}>
              Are you sure you want to delete this budget?
            </Heading>
            <Heading as={'h2'} fontSize={'md'}>
              This action cannot be undone.
            </Heading>
            <Button
              colorScheme='red'
              isDisabled={isLoading || isSubmitting}
              isLoading={isLoading || isSubmitting}
              type='submit'
              onClick={handleSubmit(() => onSubmit(selectedBudgetId))}
            >
              Delete
            </Button>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            variant='ghost'
            onClick={() => dispatch(setDeleteBudgetModalOpen(false))}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteBudgetModal;
