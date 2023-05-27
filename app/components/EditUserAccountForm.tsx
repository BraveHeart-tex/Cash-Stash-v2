'use client';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useColorModeStyles from '../hooks/useColorModeStyles';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import CreateUserAccountOptions, {
  getOptionLabel,
} from '../utils/CreateUserAccountOptions';
import useFetchCurrentAccount from '../hooks/useFetchCurrentAccount';
import FormLoadingSpinner from './FormLoadingSpinner';

interface IEditUserAccountFormProps {
  selectedAccountId: string | null;
}

const EditUserAccountForm = ({
  selectedAccountId,
}: IEditUserAccountFormProps) => {
  const { currentAccount, isLoading: isCurrentAccountLoading } =
    useFetchCurrentAccount(selectedAccountId);

  const accountOptions = Object.values(CreateUserAccountOptions);

  const { btnColor, btnBgColor, btnHoverBgColor } = useColorModeStyles();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      balance: 10,
      category: '',
      name: '',
    },
  });

  const loading = isCurrentAccountLoading || isLoading;

  useEffect(() => {
    if (currentAccount) {
      setValue('name', currentAccount.name);
      setValue(
        'category',
        getOptionLabel(CreateUserAccountOptions, currentAccount.category)
      );
      setValue('balance', currentAccount.balance);
    }
  }, [currentAccount, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // TODO: Make the request to update the account.
  };

  if (loading) {
    return <FormLoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      ID: {selectedAccountId}
      <Stack spacing={4}>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.name}>
          <FormLabel>Account Name</FormLabel>
          <Input
            type='text'
            id='name'
            {...register('name', {
              required: 'Account name is required.',
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Account Type</FormLabel>
          <Select
            id='category'
            placeholder='Select your account type'
            {...register('category', {
              required: 'Category is required.',
            })}
          >
            {accountOptions.map((option) => (
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
        <FormControl isRequired isInvalid={errors.balance}>
          <FormLabel>Balance (₺)</FormLabel>
          <Input
            type='number'
            id='balance'
            {...register('balance', {
              required: 'Balance is required.',
              min: {
                value: 10,
                message: 'Balance must be at least $10.',
              },
              max: {
                value: 1000000,
                message: 'Balance cannot exceed $1,000,000.',
              },
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.balance && errors.balance.message}
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

export default EditUserAccountForm;
