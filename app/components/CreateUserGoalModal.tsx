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
import CreateUserGoalForm from './CreateUserGoalForm';

interface ICreateUserGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateUserGoalModal = ({
  isOpen,
  onClose,
}: ICreateUserGoalModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Budget</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateUserGoalForm />
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

export default CreateUserGoalModal;
