'use client';
import { Container, Heading, Spinner } from '@chakra-ui/react';
import Navigation from '../components/Navigation';
import ReportTable from '../components/ReportsPage/ReportTable';

const ReportsPageClient = () => {
  return (
    <Container maxW={'8xl'} p={4}>
      <Navigation />
      <Heading>Reports</Heading>
      <ReportTable />
    </Container>
  );
};

export default ReportsPageClient;
