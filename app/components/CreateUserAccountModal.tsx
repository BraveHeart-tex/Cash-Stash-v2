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
import useColorModeStyles from '../hooks/useColorModeStyles';
import CreateUserAccountForm from './CreateUserAccountForm';

interface ICreateUserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateUserAccountModal = ({
  isOpen,
  onClose,
}: ICreateUserAccountModalProps) => {
  const { headingColor } = useColorModeStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={headingColor}>Create Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateUserAccountForm />
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

export default CreateUserAccountModal;
