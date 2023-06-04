'use client';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Heading,
  Button,
  ModalFooter,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import useColorModeStyles from '../../../hooks/useColorModeStyles';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  fetchGoals,
  setDeleteGoalModalOpen,
} from '../../../redux/features/goalSlice';
import { useState } from 'react';

const DeleteGoalModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { isDeleteGoalModalOpen, selectedGoalId } = useAppSelector(
    (state) => state.goalReducer
  );

  const toast = useToast();
  const { headingColor } = useColorModeStyles();

  const { handleSubmit } = useForm();

  const onSubmit = async (id: number) => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/user/goals/${id}`);
      toast({
        title: 'Goal deleted.',
        description: 'The selected goal has been deleted.',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      setIsLoading(false);
      dispatch(fetchGoals());
      dispatch(setDeleteGoalModalOpen(false));
    } catch (error: any) {
      toast({
        title: 'An error occurred.',
        description: error.response.data.error,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isDeleteGoalModalOpen}
      onClose={() => dispatch(setDeleteGoalModalOpen(false))}
      isCentered
    >
      <ModalOverlay bg={'rgba(0, 0, 0, 0.25)'} />
      <ModalContent>
        <ModalHeader color={headingColor}>Delete Goal:</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            justifyContent={'center'}
            alignItems={'center'}
            flexDirection={'column'}
            gap={4}
          >
            <Heading as={'h1'} fontSize={'xl'}>
              Are you sure you want to delete this goal?
            </Heading>
            <Heading as={'h2'} fontSize={'md'}>
              This action cannot be undone.
            </Heading>
            {isLoading ? (
              <Spinner />
            ) : (
              <Button
                colorScheme='red'
                isDisabled={isLoading}
                isLoading={isLoading}
                type='submit'
                onClick={handleSubmit(() => {
                  onSubmit(selectedGoalId);
                })}
              >
                Delete
              </Button>
            )}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            variant='ghost'
            onClick={() => dispatch(setDeleteGoalModalOpen(false))}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteGoalModal;
