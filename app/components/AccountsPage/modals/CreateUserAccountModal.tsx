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
import CreateUserAccountForm from '../forms/CreateUserAccountForm';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { setIsCreateAccountModalOpen } from '@/app/redux/features/userAccountSlice';

const CreateUserAccountModal = () => {
  const { headingColor } = useColorModeStyles();

  const dispatch = useAppDispatch();
  const { isCreateAccountModalOpen } = useAppSelector(
    (state) => state.userAccountReducer
  );

  return (
    <Modal
      isOpen={isCreateAccountModalOpen}
      onClose={() => dispatch(setIsCreateAccountModalOpen(false))}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={headingColor}>Create Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateUserAccountForm />
        </ModalBody>
        <ModalFooter>
          <Button
            variant='ghost'
            mr={3}
            onClick={() => dispatch(setIsCreateAccountModalOpen(false))}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateUserAccountModal;
