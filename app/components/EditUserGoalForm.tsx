import {
  Stack,
  FormLabel,
  Input,
  FormErrorMessage,
  FormControl,
  Select,
  Button,
} from '@chakra-ui/react';
import React from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import useColorModeStyles from '../hooks/useColorModeStyles';

interface IEditUserGoalFormProps {
  selectedGoalId: string | null | undefined;
}

const EditUserGoalForm = ({ selectedGoalId }: IEditUserGoalFormProps) => {
  const { headingColor, btnColor, btnBgColor, btnHoverBgColor } =
    useColorModeStyles();
  // TODO: implement editing a goal with the selectedGoalId
  // set the values of the form to the selected goal's values

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

  const onSubmit = async (data: FieldValues) => {};

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
