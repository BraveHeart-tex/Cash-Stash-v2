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
import EditUserAccountForm from './EditUserAccountForm';
import useColorModeStyles from '../hooks/useColorModeStyles';

interface IEditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBudgetId: string;
}

const EditBudgetModal = ({
  isOpen,
  onClose,
  selectedBudgetId,
}: IEditBudgetModalProps) => {
  const { headingColor } = useColorModeStyles();
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg={'rgba(0, 0, 0, 0.25)'} />
      <ModalContent>
        <ModalHeader color={headingColor}>Edit Account:</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Form here</ModalBody>
        <ModalFooter>
          <Button variant='ghost' mr={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditBudgetModal;
