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
} from '@chakra-ui/react';
import React from 'react';
import CreateBudgetForm from '../forms/CreateBudgetForm';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { setCreateBudgetModalOpen } from '@/app/redux/features/budgetSlice';

const CreateBudgetModal = () => {
  const dispatch = useAppDispatch();
  const { isCreateBudgetModalOpen } = useAppSelector(
    (state) => state.budgetReducer
  );

  return (
    <Modal
      isOpen={isCreateBudgetModalOpen}
      onClose={() => dispatch(setCreateBudgetModalOpen(false))}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Budget</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateBudgetForm />
        </ModalBody>
        <ModalFooter>
          <Button
            variant='ghost'
            mr={3}
            onClick={() => dispatch(setCreateBudgetModalOpen(false))}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateBudgetModal;
