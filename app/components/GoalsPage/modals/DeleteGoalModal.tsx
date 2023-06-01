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
import { useAppDispatch } from '../../../redux/hooks';
import { fetchGoals } from '../../../redux/features/goalSlice';
import { useState } from 'react';

interface IDeleteGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGoalId: string | null | undefined;
}

const DeleteGoalModal = ({
  isOpen,
  onClose,
  selectedGoalId,
}: IDeleteGoalModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { headingColor } = useColorModeStyles();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (id: string) => {
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
      onClose();
      dispatch(fetchGoals());
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
      console.log(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
                  onSubmit(selectedGoalId as string);
                })}
              >
                Delete
              </Button>
            )}
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

export default DeleteGoalModal;
