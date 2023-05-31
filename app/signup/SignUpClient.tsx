'use client';
import React, { useCallback, useState } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  Divider,
  Flex,
  Stack,
  Text,
  Link,
  useToast,
  useColorModeValue,
  useColorMode,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import Logo from '@/app/components/Logo.svg';
import { FaGithub } from 'react-icons/fa';
import { CldUploadWidget } from 'next-cloudinary';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const SignUpClient = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [imgInputValue, setImgInputValue] = useState('');
  const [httpError, setHttpError] = useState(false);
  const { colorMode } = useColorMode();

  const handleImgUpload = useCallback((result: any) => {
    setImgInputValue(result.info.secure_url);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      img: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    data = {
      ...data,
      img: imgInputValue,
    };

    setIsLoading(true);

    axios
      .post('/api/auth/register', data)
      .then((response) => {
        toast({
          title: 'Successfully signed up.',
          description: 'We have created your account for you.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        router.push('/login');
      })
      .catch((error: AxiosError) => {
        setHttpError(true);
        if (httpError) {
          toast({
            title: 'An error occurred.',
            // @ts-ignore
            description: error.response?.data.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top',
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Flex
      minH='100vh'
      align='center'
      justify='center'
      bg={useColorModeValue('gray.50', 'gray.900')}
      p={4}
    >
      <Box
        bg={useColorModeValue('gray.100', 'gray.800')}
        p={8}
        borderRadius='md'
        boxShadow='lg'
        maxW='400px'
        w='100%'
      >
        <Flex direction='column' align='center' mb={8}>
          <Image
            src={Logo}
            alt='Cash Stash'
            width={200}
            style={{
              filter:
                colorMode === 'light' ? 'brightness(0)' : 'brightness(10)',
              marginBottom: '1rem',
            }}
          />
          <Heading as='h2' size='xl' textAlign='center' mb={4}>
            Create an Account
          </Heading>
          <Text fontSize='sm' color='gray.500'>
            Get started by creating a new account
          </Text>
        </Flex>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            {/* @ts-ignore */}
            <FormControl isInvalid={errors.name}>
              <Input
                id='name'
                type='text'
                placeholder='Full Name'
                size='lg'
                borderRadius='md'
                bg={useColorModeValue('gray.100', 'gray.800')}
                _hover={{ bg: useColorModeValue('gray.200', 'gray.900') }}
                {...register('name', {
                  required: 'Full name is required.',
                })}
              />
              <FormErrorMessage>
                {/* @ts-ignore */}
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            {/* @ts-ignore */}
            <FormControl isInvalid={errors.email}>
              <Input
                id='email'
                type='email'
                placeholder='Email'
                size='lg'
                borderRadius='md'
                bg={useColorModeValue('gray.100', 'gray.800')}
                _hover={{ bg: useColorModeValue('gray.200', 'gray.900') }}
                {...register('email', {
                  required: 'A valid email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email.',
                  },
                })}
              />
              <FormErrorMessage>
                {/* @ts-ignore */}
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            {/* @ts-ignore */}
            <FormControl isInvalid={errors.password}>
              <Input
                id='password'
                type={'password'}
                placeholder='Password'
                size='lg'
                borderRadius='md'
                bg={useColorModeValue('gray.100', 'gray.800')}
                _hover={{ bg: useColorModeValue('gray.200', 'gray.900') }}
                {...register('password', {
                  required: 'Password is required.',
                  minLength: {
                    value: 6,
                    message: 'Password must have at least 6 characters',
                  },
                })}
              />
              <FormErrorMessage>
                {/* @ts-ignore */}
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <Box
              bg={useColorModeValue('blue.400', 'blue.700')}
              transition={'all .3s ease'}
              _hover={{ bg: useColorModeValue('blue.500', 'blue.800') }}
              color={'white'}
              rounded={'md'}
              p={2}
              cursor={'pointer'}
              textAlign={'center'}
            >
              <Input
                id='img'
                value={imgInputValue}
                display={'none'}
                {...register('img')}
              />
              <CldUploadWidget
                uploadPreset='ck2nb1my'
                onUpload={handleImgUpload}
              >
                {({ open }) => {
                  function handleOnClick(e: any) {
                    e.preventDefault();
                    open();
                  }
                  return (
                    <button className='button' onClick={handleOnClick}>
                      Upload an Image
                    </button>
                  );
                }}
              </CldUploadWidget>
            </Box>
            <Button
              size='lg'
              colorScheme={useColorModeValue('facebook', 'blackAlpha')}
              _hover={{
                bg: useColorModeValue('facebook.300', 'blackAlpha.400'),
              }}
              color='white'
              borderRadius='md'
              onClick={onSubmit}
              type='submit'
              isLoading={isLoading}
            >
              Sign Up
            </Button>
            <Divider />
            <Button
              variant={'outline'}
              leftIcon={<FcGoogle />}
              size='lg'
              borderRadius='md'
              onClick={() =>
                signIn('google', {
                  callbackUrl: '/',
                })
              }
              fontSize={{ base: '15px', md: '17px', lg: '18px' }}
              isDisabled={isLoading}
            >
              Sign Up with Google
            </Button>
            <Button
              variant={'outline'}
              leftIcon={<FaGithub />}
              size='lg'
              borderRadius='md'
              onClick={() =>
                signIn('github', {
                  callbackUrl: '/',
                })
              }
              fontSize={{ base: '15px', md: '17px', lg: '18px' }}
              isDisabled={isLoading}
            >
              Sign Up with Github
            </Button>
            <Text textAlign='center' mt={4}>
              Already have an account?{' '}
              <Link
                color={useColorModeValue('facebook.600', 'yellow.400')}
                href='/login'
              >
                Log In
              </Link>
            </Text>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

export default SignUpClient;
