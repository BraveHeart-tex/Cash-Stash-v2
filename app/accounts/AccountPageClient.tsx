'use client';
import {
  Box,
  Heading,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useDisclosure,
  Container,
} from '@chakra-ui/react';
import Navigation from '../components/Navigation';
import useFetchCurrentUser from '../hooks/useFetchCurrentUser';
import useFetchCurrentUserAccounts from '../hooks/useFetchCurrentUserAccounts';
import useColorModeStyles from '../hooks/useColorModeStyles';
import AccountInformation from '../components/AccountInformation';
import LoadingSpinner from '../components/Loading';
import CreateUserAccountModal from '../components/CreateUserAccountModal';

export default function AccountsPageClient() {
  const { user, isLoading: isLoadingCurrentUser } = useFetchCurrentUser();
  const { userAccounts, isLoading: isLoadingCurrentUserAccounts } =
    useFetchCurrentUserAccounts();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { headingColor, textColor } = useColorModeStyles();

  const isLoading = isLoadingCurrentUser || isLoadingCurrentUserAccounts;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxW={'8xl'} p={4}>
      <Navigation />
      <Heading as='h1' mb={4} color={headingColor}>
        Accounts
      </Heading>
      <Box mb={4}>
        <Heading as={'h2'} color={headingColor}>
          Welcome, {user?.name}!
        </Heading>
        <Text color={textColor}>
          Here you can see the accounts you&apos;ve created.
        </Text>
      </Box>
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
          <AccountInformation userAccounts={userAccounts} />
          <Button mt={4} onClick={onOpen}>
            Create Account
          </Button>
        </Box>
        <CreateUserAccountModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </Container>
  );
}
