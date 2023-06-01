'use client';
import useColorModeStyles from '@/app/hooks/useColorModeStyles';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Heading,
  Spinner,
  Button,
  ModalFooter,
  useToast,
} from '@chakra-ui/react';
import {
  fetchTransactions,
  setDeleteModalOpen,
} from '@/app/redux/features/transactionsSlice';
import { FieldValue, SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';

const DeleteTransactionModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { deleteModalOpen, transactionId } = useAppSelector(
    (state) => state.transactionsReducer
  );
  const { handleSubmit } = useForm();

  const { headingColor } = useColorModeStyles();
  const toast = useToast();

  const onSubmit = async (selectedTransactionId: number) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `/api/user/transactions/${selectedTransactionId}`
      );
      toast({
        title: 'Transaction Deleted',
        description: response.data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setIsLoading(false);
      dispatch(setDeleteModalOpen(!deleteModalOpen));
      dispatch(fetchTransactions());
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      toast({
        title: 'An error occurred while deleting transaction.',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <Modal
      isOpen={deleteModalOpen}
      onClose={() => dispatch(setDeleteModalOpen(!deleteModalOpen))}
      isCentered
    >
      <ModalOverlay bg={'rgba(0, 0, 0, 0.25)'} />
      <ModalContent>
        <ModalHeader color={headingColor}>
          Delete Transaction: {transactionId}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            justifyContent={'center'}
            alignItems={'center'}
            flexDirection={'column'}
            gap={4}
          >
            <Heading as={'h1'} fontSize={'xl'}>
              Are you sure you want to delete this transaction?
            </Heading>
            <Heading as={'h2'} fontSize={'md'} color={'red'}>
              This action cannot be undone!!
            </Heading>
            {isLoading ? (
              <Spinner />
            ) : (
              <Button
                colorScheme='red'
                isDisabled={isLoading}
                type='submit'
                onClick={handleSubmit(() => {
                  onSubmit(transactionId as number);
                })}
                isLoading={isLoading}
              >
                Delete
              </Button>
            )}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            variant='ghost'
            onClick={() => dispatch(setDeleteModalOpen(!deleteModalOpen))}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteTransactionModal;
