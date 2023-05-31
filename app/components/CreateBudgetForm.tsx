'use client';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Spinner,
  Stack,
  useToast,
} from '@chakra-ui/react';
import CreateBudgetOptions from '../utils/CreateBudgetOptions';
import { FieldValues, useForm } from 'react-hook-form';
import useColorModeStyles from '../hooks/useColorModeStyles';

interface ICreateBudgetFormProps {}

const CreateBudgetForm = ({}: ICreateBudgetFormProps) => {
  const toast = useToast();
  const budgetOptions = Object.values(CreateBudgetOptions);
  let isLoading = false;
  const { btnColor, btnBgColor, btnHoverBgColor } = useColorModeStyles();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      budgetAmount: 10,
      category: '',
      spentAmount: 0,
    },
  });

  const onSubmit = async (data: FieldValues) => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.budgetAmount}>
          <FormLabel>Budget Amount (₺)</FormLabel>
          <Input
            type='number'
            id='budgetAmount'
            {...register('budgetAmount', {
              required: 'Budget amount is required.',
              min: {
                value: 10,
                message: 'Budget amount must be at least $10.',
              },
              max: {
                value: 1000000,
                message: 'Budget amount cannot exceed $1,000,000.',
              },
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.budgetAmount && errors.budgetAmount.message}
          </FormErrorMessage>
        </FormControl>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.category}>
          <FormLabel>Budget Category</FormLabel>
          <Select
            id='category'
            placeholder='Select your budget category'
            {...register('category', {
              required: 'Category is required.',
            })}
          >
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.category && errors.category.message}
          </FormErrorMessage>
        </FormControl>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.spentAmount}>
          <FormLabel>Budget Spent (₺)</FormLabel>
          <Input
            type='number'
            id='spentAmount'
            {...register('spentAmount', {
              required:
                'Spent Amount is required. You can leave it at 0 if you have not spent any money yet.',
              min: {
                value: 0,
                message:
                  "Spent budget amount must be at least $0. You can leave it at 0 if you have'nt spent any money yet.",
              },
              max: {
                value: 1000000,
                message: 'Spent budget amount cannot exceed $1,000,000.',
              },
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.spentAmount && errors.spentAmount.message}
          </FormErrorMessage>
        </FormControl>
        {isLoading ? (
          <Button isDisabled={isSubmitting}>
            <Spinner />
          </Button>
        ) : (
          <Button
            color={btnColor}
            bg={btnBgColor}
            _hover={{ bg: btnHoverBgColor }}
            type='submit'
          >
            Create
          </Button>
        )}
      </Stack>
    </form>
  );
};

export default CreateBudgetForm;
