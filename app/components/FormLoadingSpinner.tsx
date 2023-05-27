'use client';
import { Container, Spinner, useColorModeValue } from '@chakra-ui/react';

const FormLoadingSpinner = () => {
  return (
    <Container
      height={'30vh'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Spinner color={useColorModeValue('gray.800', 'gray.400')} />
    </Container>
  );
};

export default FormLoadingSpinner;
