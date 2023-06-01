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
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Box,
  Flex,
  Container,
  useColorMode,
} from '@chakra-ui/react';
import { UserAccount } from '@prisma/client';
import CreateUserAccountOptions, {
  getOptionLabel,
} from '../../utils/CreateUserAccountOptions';
import EditUserAccountModal from './modals/EditUserAccountModal';
import { EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import ActionsIcon from '../Icons/ActionsIcon';
import DeleteIcon from '../Icons/DeleteIcon';
import DeleteUserAccountModal from './modals/DeleteUserAccountModal';
import useColorModeStyles from '../../hooks/useColorModeStyles';

interface IAccountInformationProps {
  userAccounts: UserAccount[] | undefined | null;
}

const AccountInformation = ({ userAccounts }: IAccountInformationProps) => {
  const { colorMode } = useColorMode();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { headingColor, textColor } = useColorModeStyles();

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
            <Card
              key={userAccount.id}
              bg={'transparent'}
              borderWidth={1}
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
            >
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
                  <PopoverHeader
                    textAlign={'center'}
                    fontWeight={'bold'}
                    color={headingColor}
                  >
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
                            width={4}
                            height={4}
                            bg={'transparent'}
                            mr={2}
                          />
                          <Text width={'50%'} fontSize={'md'} color={textColor}>
                            Edit{' '}
                          </Text>
                        </Flex>
                        <Flex justifyContent={'center'} alignItems={'center'}>
                          <IconButton
                            aria-label={'Delete user account'}
                            onClick={() => handleDeleteAccount(userAccount.id)}
                            icon={<DeleteIcon />}
                            width={4}
                            height={4}
                            bg={'transparent'}
                            mr={2}
                          />
                          <Text width={'50%'} color={textColor}>
                            Delete
                          </Text>
                        </Flex>
                      </SimpleGrid>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <CardHeader
                color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
              >
                <Heading size='md'>{userAccount.name}</Heading>
                <Text fontSize={'md'} textTransform={'capitalize'}>
                  Account type:{' '}
                  {getOptionLabel(
                    CreateUserAccountOptions,
                    userAccount.category
                  )}
                </Text>
              </CardHeader>
              <CardBody color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
                <Text fontWeight={'600'}>
                  Account Balance: ${userAccount.balance}
                </Text>
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
