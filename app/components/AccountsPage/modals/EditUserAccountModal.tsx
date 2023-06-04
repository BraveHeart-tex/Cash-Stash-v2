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
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { setIsEditAccountModalOpen } from '@/app/redux/features/userAccountSlice';

const EditUserAccountModal = () => {
  const { isEditAccountModalOpen, selectedUserAccountId } = useAppSelector(
    (state) => state.userAccountReducer
  );
  const dispatch = useAppDispatch();
  const { headingColor } = useColorModeStyles();

  return (
    <Modal
      isOpen={isEditAccountModalOpen}
      onClose={() =>
        dispatch(setIsEditAccountModalOpen(!isEditAccountModalOpen))
      }
      isCentered
    >
      <ModalOverlay bg={'rgba(0, 0, 0, 0.25)'} />
      <ModalContent>
        <ModalHeader color={headingColor}>Edit Account:</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <EditUserAccountForm selectedAccountId={selectedUserAccountId} />
        </ModalBody>
        <ModalFooter>
          <Button
            variant='ghost'
            mr={3}
            onClick={() =>
              dispatch(setIsEditAccountModalOpen(!isEditAccountModalOpen))
            }
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUserAccountModal;
