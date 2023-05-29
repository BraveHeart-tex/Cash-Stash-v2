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
import useColorModeStyles from '../hooks/useColorModeStyles';

interface IDeleteBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBudgetId: string;
}

const DeleteBudgetModal = ({
  isOpen,
  onClose,
  selectedBudgetId,
}: IDeleteBudgetModalProps) => {
  const { headingColor } = useColorModeStyles();
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg={'rgba(0, 0, 0, 0.25)'} />
      <ModalContent>
        <ModalHeader color={headingColor}>Edit Account:</ModalHeader>
        <ModalCloseButton />
        <ModalBody> confirmation modal here id: {selectedBudgetId}</ModalBody>
        <ModalFooter>
          <Button variant='ghost' mr={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteBudgetModal;
