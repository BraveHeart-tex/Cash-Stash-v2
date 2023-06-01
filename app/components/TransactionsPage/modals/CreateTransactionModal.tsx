'use client';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
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
import { setCreateModalOpen } from '@/app/redux/features/transactionsSlice';
import CreateTransactionForm from '../forms/CreateTransactionForm';

const CreateTransactionModal = () => {
  const dispatch = useAppDispatch();
  const { createModalOpen } = useAppSelector(
    (state) => state.transactionsReducer
  );

  return (
    <Modal
      isOpen={createModalOpen}
      onClose={() => dispatch(setCreateModalOpen(!createModalOpen))}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Transaction</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateTransactionForm />
        </ModalBody>
        <ModalFooter>
          <Button
            variant='ghost'
            mr={3}
            onClick={() => dispatch(setCreateModalOpen(!createModalOpen))}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateTransactionModal;
