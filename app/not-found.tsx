'use client';
import {
  Container,
  Heading,
  Text,
  Button,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

const NotFound = () => {
  return (
    <Container
      maxW={'8xl'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      height={'100vh'}
    >
      <SimpleGrid column={1} gap={4}>
        <Heading
          bgGradient={useColorModeValue(
            'linear(to-l, #464646,#4f4f4f)',
            'linear(to-l, #e3e3e3,#c5c5c5)'
          )}
          bgClip={'text'}
        >
          404 Page Not Found...
        </Heading>
        <Text>
          Looks like you tried to navigate to a page that doesn&apos;t exist.
        </Text>
        <Button
          width={'fit-content'}
          bg={useColorModeValue('gray.300', 'gray.700')}
          color={useColorModeValue('gray.700', 'gray.300')}
          _hover={{
            bg: useColorModeValue('gray.400', 'gray.600'),
            color: useColorModeValue('gray.600', 'gray.400'),
          }}
        >
          <Link href={'/accounts'}>Back to the home page</Link>
        </Button>
      </SimpleGrid>
    </Container>
  );
};

export default NotFound;
