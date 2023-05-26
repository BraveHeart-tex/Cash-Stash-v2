'use client';
import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  UnorderedList,
  ListItem,
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
  FormErrorMessage,
  useDisclosure,
  Container,
} from '@chakra-ui/react';
import Navigation from '../components/Navigation';
import { User } from '@prisma/client';

interface IAccountPageClientProps {
  user: User | null;
}

export default function AccountsPageClient({ user }: IAccountPageClientProps) {
  const [accounts, setAccounts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container maxW={'8xl'} p={4}>
      <Navigation user={user} />
      <Box>
        <Heading as='h1' mb={4}>
          Accounts
        </Heading>
        {accounts.length > 0 ? (
          <UnorderedList>
            <ListItem mb={4}>
              <Heading as='h2' size='md' mb={2}>
                Savings Account
              </Heading>
              <Text>Balance: $100</Text>
              {/* Display other account information */}
            </ListItem>
          </UnorderedList>
        ) : (
          <Text>No accounts found.</Text>
        )}
        <Button mt={4} onClick={onOpen}>
          Create Account
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Account</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <FormControl id='accountName' isRequired>
                  <FormLabel>Account Name</FormLabel>
                  <Input type='text' />
                  {/* <FormErrorMessage>{error}</FormErrorMessage> */}
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button variant='ghost' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='blue'>Create</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Container>
  );
}
