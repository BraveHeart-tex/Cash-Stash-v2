'use client';
import {
  Stack,
  FormLabel,
  Input,
  FormErrorMessage,
  FormControl,
  Button,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useColorModeStyles from '../../../hooks/useColorModeStyles';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchGoalById } from '../../../redux/features/currentGoalSlice';
import {
  fetchGoals,
  setEditGoalModalOpen,
} from '../../../redux/features/goalSlice';
import axios from 'axios';
import FormLoadingSpinner from '../../FormLoadingSpinner';

interface IEditUserGoalFormProps {
  selectedGoalId: number;
}

const EditUserGoalForm = ({ selectedGoalId }: IEditUserGoalFormProps) => {
  const { currentGoal } = useAppSelector((state) => state.currentGoalReducer);
  const dispatch = useAppDispatch();
  const { btnColor, btnBgColor, btnHoverBgColor } = useColorModeStyles();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      goalName: '',
      goalAmount: 10,
      currentAmount: 0,
    },
  });

  useEffect(() => {
    if (selectedGoalId) {
      dispatch(fetchGoalById(selectedGoalId));
    }
  }, [dispatch, selectedGoalId]);

  useEffect(() => {
    if (currentGoal) {
      setValue('goalName', currentGoal.name);
      setValue('goalAmount', currentGoal.goalAmount);
      setValue('currentAmount', currentGoal.currentAmount);
    }
  }, [currentGoal, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    try {
      const response = await axios.put(
        `api/user/goals/${selectedGoalId}`,
        data
      );
      toast({
        title: 'Goal updated.',
        description:
          'Your goal has been updated. You can close this window now.',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      dispatch(fetchGoals());
      dispatch(setEditGoalModalOpen(false));
    } catch (error: any) {
      toast({
        title: 'An error occurred.',
        description: `Unable to update the selected goal.`,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  if (!currentGoal) {
    return <FormLoadingSpinner />;
  }

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
              required: 'Goal Amount is required.',
              min: {
                value: 10,
                message: 'Goal Amount must be at least $10.',
              },
              max: {
                value: 1000000,
                message: 'Goal Amount cannot exceed $1,000,000.',
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
              required: 'Current Amount is required.',
              min: {
                value: 0,
                message: 'Current Amount must be at least $0.',
              },
              max: {
                value: 1000000,
                message: 'Current Amount cannot exceed $1,000,000.',
              },
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.currentAmount && errors.currentAmount.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          color={btnColor}
          bg={btnBgColor}
          _hover={{
            bg: btnHoverBgColor,
          }}
          type='submit'
          isLoading={isSubmitting}
          isDisabled={isLoading}
        >
          Update
        </Button>
      </Stack>
    </form>
  );
};

export default EditUserGoalForm;
