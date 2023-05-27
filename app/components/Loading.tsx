'use client';
import { Container, Spinner, useColorModeValue } from '@chakra-ui/react';

const LoadingSpinner = () => {
  return (
    <Container
      height={'100vh'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Spinner color={useColorModeValue('gray.800', 'gray.400')} />
    </Container>
  );
};

export default LoadingSpinner;
