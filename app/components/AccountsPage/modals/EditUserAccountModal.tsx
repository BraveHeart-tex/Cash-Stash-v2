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
import EditUserAccountForm from '../forms/EditUserAccountForm';

interface IEditUserAccountModalModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAccountId: number | null;
}

const EditUserAccountModal = ({
  isOpen,
  onClose,
  selectedAccountId,
}: IEditUserAccountModalModalProps) => {
  const { headingColor } = useColorModeStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg={'rgba(0, 0, 0, 0.25)'} />
      <ModalContent>
        <ModalHeader color={headingColor}>Edit Account:</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <EditUserAccountForm selectedAccountId={selectedAccountId} />
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

export default EditUserAccountModal;
