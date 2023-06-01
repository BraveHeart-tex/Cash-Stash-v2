'use client';
import { Container, Heading } from '@chakra-ui/react';
import Navigation from '../components/Navigation';

const ReportsPageClient = () => {
  return (
    <Container maxW={'8xl'} p={4}>
      <Navigation />
      <Heading>Reports</Heading>
    </Container>
  );
};

export default ReportsPageClient;
