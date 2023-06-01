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

interface IEditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGoalId: string | null | undefined;
}

const EditGoalModal = ({
  isOpen,
  onClose,
  selectedGoalId,
}: IEditGoalModalProps) => {
  const { headingColor } = useColorModeStyles();
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg={'rgba(0, 0, 0, 0.25)'} />
      <ModalContent>
        <ModalHeader color={headingColor}>Edit Goal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <EditUserGoalForm selectedGoalId={selectedGoalId} />
        </ModalBody>
        <ModalFooter>
          <Button variant='ghost' mr={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditGoalModal;
