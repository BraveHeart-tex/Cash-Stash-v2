'use client';
import React, { useState } from 'react';
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
  FormControl,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import logo from '@/app/components/Logo.svg';
import { signIn } from 'next-auth/react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

const LoginClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { colorMode } = useColorMode();

  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    signIn('credentials', {
      ...data,
      callbackUrl: '/',
      redirect: true,
    }).then((callback) => {
      setIsLoading(false);
      if (callback?.error) {
        toast({
          title: 'Sign in failed, please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
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
            src={logo}
            alt='Cash Stash'
            width={200}
            style={{
              filter:
                colorMode === 'light' ? 'brightness(0)' : 'brightness(10)',
              marginBottom: '1rem',
            }}
          />
          <Heading as='h2' size='xl' textAlign='center' mb={4}>
            Welcome!
          </Heading>
          <Text fontSize='sm' color='gray.500'>
            Log in to access your account
          </Text>
        </Flex>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl>
              <Input
                id='email'
                type='email'
                placeholder='Email'
                required
                size='lg'
                borderRadius='md'
                bg={useColorModeValue('gray.100', 'gray.800')}
                _hover={{ bg: useColorModeValue('gray.200', 'gray.900') }}
                {...register('email', {
                  required: 'This is required',
                })}
              />
            </FormControl>
            <FormControl>
              <Input
                id='password'
                type='password'
                placeholder='Password'
                required
                size='lg'
                borderRadius='md'
                bg={useColorModeValue('gray.100', 'gray.800')}
                _hover={{ bg: useColorModeValue('gray.200', 'gray.900') }}
                {...register('password', {
                  required: 'This is required',
                })}
              />
            </FormControl>
            <Button
              colorScheme='facebook'
              _hover={{ bg: 'facebook.300' }}
              size='lg'
              borderRadius='md'
              type='submit'
              isLoading={isLoading}
            >
              Sign In
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
                  redirect: true,
                })
              }
              disabled={isLoading}
              fontSize={{ base: '15px', md: '17px', lg: '18px' }}
            >
              Sign In with Google
            </Button>
            <Button
              variant={'outline'}
              leftIcon={<FaGithub />}
              size='lg'
              borderRadius='md'
              onClick={() =>
                signIn('github', {
                  callbackUrl: '/',
                  redirect: true,
                })
              }
              disabled={isLoading}
              fontSize={{ base: '15px', md: '17px', lg: '18px' }}
            >
              Sign In with Github
            </Button>
            <Text textAlign='center' mt={4}>
              Don&apos;t have an account?{' '}
              <Link
                color={useColorModeValue('facebook.600', 'yellow.400')}
                href='/signup'
              >
                Sign Up
              </Link>
            </Text>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

export default LoginClient;
