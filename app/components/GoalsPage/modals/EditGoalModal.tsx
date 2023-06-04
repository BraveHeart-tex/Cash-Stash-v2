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
import useColorModeStyles from '../../../hooks/useColorModeStyles';
import EditUserGoalForm from '../forms/EditUserGoalForm';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { setEditGoalModalOpen } from '@/app/redux/features/goalSlice';

const EditGoalModal = () => {
  const { headingColor } = useColorModeStyles();
  const { isEditGoalModalOpen, selectedGoalId } = useAppSelector(
    (state) => state.goalReducer
  );
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={isEditGoalModalOpen}
      onClose={() => dispatch(setEditGoalModalOpen(false))}
      isCentered
    >
      <ModalOverlay bg={'rgba(0, 0, 0, 0.25)'} />
      <ModalContent>
        <ModalHeader color={headingColor}>Edit Goal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <EditUserGoalForm selectedGoalId={selectedGoalId} />
        </ModalBody>
        <ModalFooter>
          <Button
            variant='ghost'
            mr={3}
            onClick={() => dispatch(setEditGoalModalOpen(false))}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditGoalModal;
