'use client';
import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  useToast,
  Button,
} from '@chakra-ui/react';
import CreateUserAccountOptions from '../../../utils/CreateUserAccountOptions';
import React, { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import useColorModeStyles from '../../../hooks/useColorModeStyles';
import { useAppDispatch } from '../../../redux/hooks';
import {
  fetchCurrentUserAccounts,
  setIsCreateAccountModalOpen,
} from '../../../redux/features/userAccountSlice';

const CreateUserAccountForm = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const accountOptions = Object.values(CreateUserAccountOptions);
  const { btnColor, btnBgColor, btnHoverBgColor } = useColorModeStyles();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      balance: 10,
      category: '',
      name: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    axios
      .post('/api/user/accounts', data)
      .then(() => {
        setIsLoading(false);
        reset();
        dispatch(fetchCurrentUserAccounts());
        toast({
          title: 'Account created.',
          description:
            'Your account has been created. You can close this window now.',
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'top',
        });
        dispatch(setIsCreateAccountModalOpen(false));
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          title: 'Error creating account.',
          description: 'There was an error creating your account.',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'top',
        });
      });
  };

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
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.category}>
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

export default CreateUserAccountForm;
