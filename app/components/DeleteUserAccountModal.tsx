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
  Heading,
  Flex,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import useColorModeStyles from '../hooks/useColorModeStyles';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../redux/hooks';
import { fetchCurrentUserAccounts } from '../redux/features/userAccountSlice';

interface IDeleteUserAccountModalProps {
  selectedAccountId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteUserAccountModal = ({
  selectedAccountId,
  isOpen,
  onClose,
}: IDeleteUserAccountModalProps) => {
  const { headingColor } = useColorModeStyles();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const {
    handleSubmit,
    formState: { isLoading, isSubmitting },
  } = useForm();

  const onSubmit = async (id: string) => {
    try {
      await axios.delete(`/api/user/accounts/${id}`);
      dispatch(fetchCurrentUserAccounts());
      toast({
        title: 'Account deleted.',
        description: 'The account has been deleted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'An error occurred.',
        description: 'Unable to delete account. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      console.log(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg={'rgba(0, 0, 0, 0.25)'} />
      <ModalContent>
        <ModalHeader color={headingColor}>Delete Account:</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            justifyContent={'center'}
            alignItems={'center'}
            flexDirection={'column'}
            gap={4}
          >
            <Heading as={'h1'} fontSize={'xl'}>
              Are you sure you want to delete this account?
            </Heading>
            <Heading as={'h2'} fontSize={'md'}>
              This action cannot be undone.
            </Heading>
            <Button
              colorScheme='red'
              disabled={isLoading || isSubmitting}
              isLoading={isLoading || isSubmitting}
              type='submit'
              onClick={handleSubmit(() =>
                onSubmit(selectedAccountId as string)
              )}
            >
              Delete
            </Button>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button variant='ghost' onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteUserAccountModal;
