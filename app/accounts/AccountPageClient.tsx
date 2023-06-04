'use client';
import {
  Box,
  Heading,
  Button,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import Navigation from '../components/Navigation';
import useColorModeStyles from '../hooks/useColorModeStyles';
import CreateUserAccountModal from '../components/AccountsPage/modals/CreateUserAccountModal';
import AccountsFilter from '../components/AccountsPage/AccountFilter';
import { useAppDispatch } from '../redux/hooks';
import { setIsCreateAccountModalOpen } from '../redux/features/userAccountSlice';

export default function AccountsPageClient() {
  const dispatch = useAppDispatch();
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
        <Box width={'100%'}>
          <AccountsFilter />
        </Box>
        <Button
          mt={4}
          onClick={() => dispatch(setIsCreateAccountModalOpen(true))}
          bg={useColorModeValue('gray.300', 'gray.700')}
        >
          Create Account
        </Button>
        <CreateUserAccountModal />
      </Box>
    </Container>
  );
}
