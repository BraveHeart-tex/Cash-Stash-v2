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
import CreateReminderForm from '../forms/CreateReminderForm';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { setIsCreateReminderModalOpen } from '@/app/redux/features/remindersSlice';

const CreateReminderModal = () => {
  const dispatch = useAppDispatch();
  const { isCreateReminderModalOpen } = useAppSelector(
    (state) => state.remindersReducer
  );

  return (
    <Modal
      isOpen={isCreateReminderModalOpen}
      onClose={() =>
        dispatch(setIsCreateReminderModalOpen(!isCreateReminderModalOpen))
      }
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a Reminder</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateReminderForm />
        </ModalBody>
        <ModalFooter>
          <Button
            variant='ghost'
            mr={3}
            onClick={() =>
              dispatch(setIsCreateReminderModalOpen(!isCreateReminderModalOpen))
            }
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateReminderModal;
