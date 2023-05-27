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
} from '@chakra-ui/react';
import { UserAccount } from '@prisma/client';
import CreateUserAccountOptions, {
  getOptionLabel,
} from '../utils/CreateUserAccountOptions';
import EditUserAccountModal from './EditUserAccountModal';
import { EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';

interface IAccountInformationProps {
  userAccounts: UserAccount[] | undefined | null;
}

const AccountInformation = ({ userAccounts }: IAccountInformationProps) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleEditAccount = (accountId: string) => {
    setSelectedAccountId(accountId);
    onOpen();
  };

  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={8}>
        {userAccounts && userAccounts?.length > 0 ? (
          userAccounts.map((userAccount) => (
            <Card key={userAccount.id}>
              <IconButton
                aria-label={'Edit user account'}
                onClick={() => handleEditAccount(userAccount.id)}
                icon={<EditIcon />}
                position={'absolute'}
                top={2}
                right={2}
                width={5}
                height={5}
                bg={'transparent'}
              />
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
          <Text>No accounts found.</Text>
        )}
      </SimpleGrid>
      <EditUserAccountModal
        selectedAccountId={selectedAccountId}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

export default AccountInformation;
