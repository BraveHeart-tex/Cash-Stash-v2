'use client';
import {
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  IconButton,
  useDisclosure,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Box,
  Flex,
  Container,
} from '@chakra-ui/react';
import { UserAccount } from '@prisma/client';
import CreateUserAccountOptions, {
  getOptionLabel,
} from '../utils/CreateUserAccountOptions';
import EditUserAccountModal from './EditUserAccountModal';
import { EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import ActionsIcon from './ActionsIcon';
import DeleteIcon from './DeleteIcon';
import DeleteUserAccountModal from './DeleteUserAccountModal';

interface IAccountInformationProps {
  userAccounts: UserAccount[] | undefined | null;
}

const AccountInformation = ({ userAccounts }: IAccountInformationProps) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleEditAccount = (accountId: string) => {
    setSelectedAccountId(accountId);
    onOpen();
  };

  const handleDeleteAccount = (accountId: string) => {
    setSelectedAccountId(accountId);
    setIsDeleteAccountModalOpen(true);
  };

  const onDeleteAccountModalClose = () => {
    setSelectedAccountId(null);
    setIsDeleteAccountModalOpen(false);
  };

  return (
    <Container maxW={'8xl'}>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={8}>
        {userAccounts && userAccounts?.length > 0 ? (
          userAccounts.map((userAccount) => (
            <Card key={userAccount.id}>
              <Popover>
                <PopoverTrigger>
                  <IconButton
                    icon={<ActionsIcon />}
                    aria-label='account actions'
                    bg={'transparent'}
                    width={5}
                    height={5}
                    position={'absolute'}
                    top={2}
                    right={2}
                    mb={2}
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader fontWeight={'bold'} textAlign={'center'}>
                    Account Actions
                  </PopoverHeader>
                  <PopoverBody>
                    <Flex justifyContent={'center'} alignItems={'center'}>
                      <SimpleGrid columns={1} gap={4}>
                        <Flex justifyContent={'center'} alignItems={'center'}>
                          <IconButton
                            aria-label={'Edit user account'}
                            onClick={() => handleEditAccount(userAccount.id)}
                            icon={<EditIcon />}
                            width={5}
                            height={5}
                            bg={'transparent'}
                            mr={2}
                          />
                          <Text width={'50%'}>Edit </Text>
                        </Flex>
                        <Flex justifyContent={'center'} alignItems={'center'}>
                          <IconButton
                            aria-label={'Delete user account'}
                            onClick={() => handleDeleteAccount(userAccount.id)}
                            icon={<DeleteIcon />}
                            width={5}
                            height={5}
                            bg={'transparent'}
                            mr={2}
                          />
                          <Text width={'50%'}>Delete </Text>
                        </Flex>
                      </SimpleGrid>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <CardHeader>
                <Heading size='md'>{userAccount.name}</Heading>
                <Text fontSize={'md'} textTransform={'capitalize'}>
                  Account type:{' '}
                  {getOptionLabel(
                    CreateUserAccountOptions,
                    userAccount.category
                  )}
                </Text>
              </CardHeader>
              <CardBody>
                <Text>Account Balance: ${userAccount.balance}</Text>
              </CardBody>
            </Card>
          ))
        ) : (
          <Box my={4}>
            <Heading size={'md'}>No accounts found</Heading>
            <Text>
              You can remove the filter to see all accounts or create a new one
              with this category.
            </Text>
          </Box>
        )}
      </SimpleGrid>
      <EditUserAccountModal
        selectedAccountId={selectedAccountId}
        isOpen={isOpen}
        onClose={onClose}
      />
      <DeleteUserAccountModal
        selectedAccountId={selectedAccountId}
        isOpen={isDeleteAccountModalOpen}
        onClose={onDeleteAccountModalClose}
      />
    </Container>
  );
};

export default AccountInformation;
