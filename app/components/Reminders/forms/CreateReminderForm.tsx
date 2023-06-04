'use client';
import useColorModeStyles from '@/app/hooks/useColorModeStyles';
import {
  fetchReminders,
  setIsCreateReminderModalOpen,
} from '@/app/redux/features/remindersSlice';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  Stack,
  FormLabel,
  Input,
  FormErrorMessage,
  FormControl,
  Button,
  useToast,
  Select,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';

const CreateReminderForm = () => {
  const dispatch = useAppDispatch();
  const { isCreateReminderModalOpen } = useAppSelector(
    (state) => state.remindersReducer
  );
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { btnColor, btnBgColor, btnHoverBgColor } = useColorModeStyles();

  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      description: '',
      amount: '',
      reminderDate: '',
      isIncome: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/user/reminders', data);
      toast({
        title: 'Successfully created a reminder.',
        description: `You have created a reminder successfully`,
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      setIsLoading(false);
      dispatch(fetchReminders());
      dispatch(setIsCreateReminderModalOpen(!isCreateReminderModalOpen));
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'There was an error trying to create a reminder.',
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
        <FormControl isRequired isInvalid={errors.title}>
          <FormLabel>Title</FormLabel>
          <Input
            type='text'
            id='title'
            {...register('title', {
              required: 'Title is required.',
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters long',
              },
              maxLength: {
                value: 20,
                message: 'Title must be at most 20 characters long',
              },
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.title && errors.title.message}
          </FormErrorMessage>
        </FormControl>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.description}>
          <FormLabel>Description</FormLabel>
          <Input
            type='text'
            id='description'
            {...register('description', {
              required: 'Description is required.',
              minLength: {
                value: 3,
                message: 'Description must be at least 3 characters long',
              },
              maxLength: {
                value: 50,
                message: 'Description must be at most 50 characters long',
              },
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.amount && errors.amount.message}
          </FormErrorMessage>
        </FormControl>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.amount}>
          <FormLabel>Amount (₺)</FormLabel>
          <Input
            type='number'
            id='amount'
            {...register('amount', {
              required: 'Amount is required.',
              min: {
                value: 1,
                message: 'Amount must at least be 1₺',
              },
              max: {
                value: 1000000,
                message: 'Amount cannot exceed 1.000.000₺',
              },
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.amount && errors.amount.message}
          </FormErrorMessage>
        </FormControl>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.reminderDate}>
          <FormLabel>Reminder Date</FormLabel>
          <Input
            min={today}
            type='date'
            id='reminderDate'
            {...register('reminderDate', {
              required: 'Reminder Date is required.',
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.amount && errors.amount.message}
          </FormErrorMessage>
        </FormControl>
        {/* expense or income */}
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.isIncome}>
          <FormLabel>Type</FormLabel>
          <Select
            id='isIncome'
            {...register('isIncome', {
              required: 'Transaction type for reminder is required.',
            })}
          >
            <option value='income'>Income</option>
            <option value='expense'>Expense</option>
          </Select>
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.isIncome && errors.isIncome.message}
          </FormErrorMessage>
        </FormControl>
        {isLoading ? (
          <Button>Loading...</Button>
        ) : (
          <Button
            color={btnColor}
            bg={btnBgColor}
            _hover={{
              bg: btnHoverBgColor,
            }}
            type='submit'
            isDisabled={isSubmitting || isLoading}
          >
            Create
          </Button>
        )}
      </Stack>
    </form>
  );
};

export default CreateReminderForm;
