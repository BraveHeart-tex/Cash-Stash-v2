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
import useColorModeStyles from '../../../hooks/useColorModeStyles';
import EditUserBudgetForm from '../forms/EditBudgetForm';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { setEditBudgetModalOpen } from '@/app/redux/features/budgetSlice';

const EditBudgetModal = () => {
  const { headingColor } = useColorModeStyles();
  const dispatch = useAppDispatch();
  const { isEditBudgetModalOpen, selectedBudgetId } = useAppSelector(
    (state) => state.budgetReducer
  );

  return (
    <Modal
      isOpen={isEditBudgetModalOpen}
      onClose={() => dispatch(setEditBudgetModalOpen(false))}
      isCentered
    >
      <ModalOverlay bg={'rgba(0, 0, 0, 0.25)'} />
      <ModalContent>
        <ModalHeader color={headingColor}>Edit Budget:</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <EditUserBudgetForm selectedBudgetId={selectedBudgetId} />
        </ModalBody>
        <ModalFooter>
          <Button
            variant='ghost'
            mr={3}
            onClick={() => dispatch(setEditBudgetModalOpen(false))}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditBudgetModal;
