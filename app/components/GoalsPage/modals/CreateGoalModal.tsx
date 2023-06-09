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
import CreateUserGoalForm from '../forms/CreateGoalForm';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { setCreateGoalModalOpen } from '@/app/redux/features/goalSlice';

const CreateUserGoalModal = () => {
  const { isCreateGoalModalOpen } = useAppSelector(
    (state) => state.goalReducer
  );
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={isCreateGoalModalOpen}
      onClose={() => dispatch(setCreateGoalModalOpen(false))}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Goal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateUserGoalForm />
        </ModalBody>
        <ModalFooter>
          <Button
            variant='ghost'
            mr={3}
            onClick={() => dispatch(setCreateGoalModalOpen(false))}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateUserGoalModal;
