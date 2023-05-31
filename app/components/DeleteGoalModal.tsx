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
} from '@chakra-ui/react';
import React from 'react';
import useColorModeStyles from '../hooks/useColorModeStyles';

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
  const { headingColor } = useColorModeStyles();
  // TODO: implement deleting a goal with the selectedGoalId
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
            <Button
              colorScheme='red'
              // isDisabled={isLoading || isSubmitting}
              // isLoading={isLoading || isSubmitting}
              type='submit'
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

export default DeleteGoalModal;
