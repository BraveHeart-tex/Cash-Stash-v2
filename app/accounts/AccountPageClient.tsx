'use client';
import {
  Box,
  Heading,
  Button,
  useDisclosure,
  Container,
} from '@chakra-ui/react';
import Navigation from '../components/Navigation';
import useColorModeStyles from '../hooks/useColorModeStyles';
import CreateUserAccountModal from '../components/CreateUserAccountModal';
import AccountsFilter from '../components/AccountFilter';

export default function AccountsPageClient() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { headingColor } = useColorModeStyles();
  return (
    <Container maxW={'8xl'} p={4}>
      <Navigation />
      <Heading as='h3' fontSize={'3xl'} mb={4} color={headingColor}>
        Accounts
      </Heading>
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        flexDirection={'column'}
        gap={4}
      >
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          flexDirection={'column'}
          width={'100%'}
        >
          <AccountsFilter />
          <Button mt={4} onClick={onOpen}>
            Create Account
          </Button>
        </Box>
        <CreateUserAccountModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </Container>
  );
}
