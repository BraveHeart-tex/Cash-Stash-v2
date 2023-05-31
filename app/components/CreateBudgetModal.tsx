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
import CreateBudgetForm from './CreateBudgetForm';

interface ICreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBudgetModal = ({ isOpen, onClose }: ICreateBudgetModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Budget</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateBudgetForm />
        </ModalBody>
        <ModalFooter>
          <Button variant='ghost' mr={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateBudgetModal;
