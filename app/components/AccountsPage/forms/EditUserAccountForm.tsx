'use client';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import useColorModeStyles from '../../../hooks/useColorModeStyles';
import { useForm, SubmitHandler } from 'react-hook-form';
import CreateUserAccountOptions, {
  getOptionLabel,
} from '../../../utils/CreateUserAccountOptions';
import FormLoadingSpinner from '../../FormLoadingSpinner';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchCurrentAccount } from '../../../redux/features/currentAccountSlice';
import {
  fetchCurrentUserAccounts,
  setIsEditAccountModalOpen,
} from '../../../redux/features/userAccountSlice';

interface IEditUserAccountFormProps {
  selectedAccountId: number | null;
}

interface FormValues {
  name: string;
  category: string;
  balance: number;
}

const EditUserAccountForm = ({
  selectedAccountId,
}: IEditUserAccountFormProps) => {
  const { currentAccount, isLoading: isCurrentAccountLoading } = useAppSelector(
    (state) => state.currentAccountReducer
  );

  const dispatch = useAppDispatch();

  const accountOptions = Object.values(CreateUserAccountOptions);

  const { btnColor, btnBgColor, btnHoverBgColor } = useColorModeStyles();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      balance: 10,
      category: '',
      name: '',
    },
  });

  const loading = isCurrentAccountLoading || isLoading;

  useEffect(() => {
    if (selectedAccountId) {
      dispatch(fetchCurrentAccount(selectedAccountId));
    }
  }, [dispatch, selectedAccountId]);

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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await axios.put(
        `/api/user/accounts/${selectedAccountId}`,
        data
      );

      if (response.status === 200) {
        dispatch(fetchCurrentUserAccounts());
        toast({
          title: 'Account updated.',
          description:
            'Account has been updated successfully. You can close this window now.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        dispatch(setIsEditAccountModalOpen(false));
      }
    } catch (error: any) {
      toast({
        title: 'An error occurred.',
        description: error.response?.data.error,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  if (loading) {
    return <FormLoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
