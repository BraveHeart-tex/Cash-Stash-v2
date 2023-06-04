'use client';
import { setIsEditReminderModalOpen } from '@/app/redux/features/remindersSlice';
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
import EditReminderForm from '../forms/EditReminderForm';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';

const EditReminderModal = () => {
  const { isEditReminderModalOpen, selectedReminderId } = useAppSelector(
    (state) => state.remindersReducer
  );
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={isEditReminderModalOpen}
      onClose={() =>
        dispatch(setIsEditReminderModalOpen(!isEditReminderModalOpen))
      }
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Reminder</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <EditReminderForm />
        </ModalBody>
        <ModalFooter>
          <Button
            variant='ghost'
            mr={3}
            onClick={() =>
              dispatch(setIsEditReminderModalOpen(!isEditReminderModalOpen))
            }
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditReminderModal;
