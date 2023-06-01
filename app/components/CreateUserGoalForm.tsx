import {
  Stack,
  FormLabel,
  Input,
  FormErrorMessage,
  FormControl,
  Button,
  useToast,
} from '@chakra-ui/react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useColorModeStyles from '../hooks/useColorModeStyles';
import axios from 'axios';
import { useAppDispatch } from '../redux/hooks';
import { fetchGoals } from '../redux/features/goalSlice';

const CreateUserGoalForm = () => {
  const dispatch = useAppDispatch();
  const { btnColor, btnBgColor, btnHoverBgColor } = useColorModeStyles();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      goalName: '',
      goalAmount: 10,
      currentAmount: '0',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await axios.post('/api/user/goals', data);
      toast({
        title: 'Goal created.',
        description:
          'Your goal has been created. You can close this window now.',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      dispatch(fetchGoals());
      reset();
    } catch (error: any) {
      toast({
        title: 'An error occurred.',
        description: error.response.data.error,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.goalName}>
          <FormLabel>Goal Name</FormLabel>
          <Input
            type='text'
            id='goalName'
            {...register('goalName', {
              required: 'Goal name is required.',
              minLength: {
                value: 3,
                message: 'Goal name must be at least 3 characters long.',
              },
              maxLength: {
                value: 50,
                message: 'Goal name cannot exceed 50 characters.',
              },
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.goalName && errors.goalName.message}
          </FormErrorMessage>
        </FormControl>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.goalAmount}>
          <FormLabel>Goal Amount (₺)</FormLabel>
          <Input
            type='number'
            id='goalAmount'
            {...register('goalAmount', {
              required: 'Goal amount is required.',
              min: {
                value: 10,
                message: 'Goal amount must be at least $10.',
              },
              max: {
                value: 1000000,
                message: 'Goal amount cannot exceed $1,000,000.',
              },
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.goalAmount && errors.goalAmount.message}
          </FormErrorMessage>
        </FormControl>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.currentAmount}>
          <FormLabel>Current Amount (₺)</FormLabel>
          <Input
            type='number'
            id='currentAmount'
            {...register('currentAmount', {
              required: 'Current amount is required.',
              min: {
                value: 0,
                message: 'Current amount must be at least $0.',
              },
              max: {
                value: 1000000,
                message: 'Current amount cannot exceed $1,000,000.',
              },
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.currentAmount && errors.currentAmount.message}
          </FormErrorMessage>
        </FormControl>
        {isSubmitting ? (
          <Button>Loading...</Button>
        ) : (
          <Button
            color={btnColor}
            bg={btnBgColor}
            _hover={{
              bg: btnHoverBgColor,
            }}
            type='submit'
            isDisabled={isSubmitting}
          >
            Create
          </Button>
        )}
      </Stack>
    </form>
  );
};

export default CreateUserGoalForm;
