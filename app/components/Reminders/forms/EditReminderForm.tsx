'use client';
import useColorModeStyles from '@/app/hooks/useColorModeStyles';
import {
  fetchReminderById,
  fetchReminders,
  setIsEditReminderModalOpen,
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
  Checkbox,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import FormLoadingSpinner from '../../FormLoadingSpinner';
import axios from 'axios';

const EditReminderForm = () => {
  const { btnColor, btnBgColor, btnHoverBgColor } = useColorModeStyles();
  const toast = useToast();

  const {
    selectedReminderId,
    currentReminder,
    isLoading,
    isEditReminderModalOpen,
  } = useAppSelector((state) => state.remindersReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedReminderId) {
      dispatch(fetchReminderById(selectedReminderId));
    }
  }, [dispatch, selectedReminderId]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      description: '',
      amount: '',
      reminderDate: '',
      isIncome: '',
      isRead: 'isNotRead',
    },
  });

  useEffect(() => {
    if (currentReminder) {
      setValue('title', currentReminder.title);
      setValue('description', currentReminder.description);
      setValue('amount', currentReminder.amount);
      setValue('isIncome', currentReminder.isIncome ? 'income' : 'expense');
      setValue(
        'reminderDate',
        new Date(currentReminder.reminderDate).toLocaleDateString('en-CA')
      );
    }
  }, [currentReminder, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await axios.put(
        `/api/user/reminders/${selectedReminderId}`,
        data
      );
      toast({
        title: 'Reminder updated.',
        description: 'Reminder updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      dispatch(fetchReminders());
      dispatch(setIsEditReminderModalOpen(!isEditReminderModalOpen));
    } catch (error) {
      toast({
        title: 'An error occurred while updating the reminder.',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (isLoading) {
    return <FormLoadingSpinner />;
  }

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
        {/* is read */}
        {/* @ts-ignore */}
        <FormControl isInvalid={errors.isRead}>
          <FormLabel>Mark as read</FormLabel>
          <Checkbox id='isRead' onChange={() => setValue('isRead', 'isRead')} />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.isRead && errors.isRead.message}
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
            Update
          </Button>
        )}
      </Stack>
    </form>
  );
};

export default EditReminderForm;
