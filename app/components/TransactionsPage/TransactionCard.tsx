'use client';
import {
  Box,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  useColorMode,
  Text,
  Stack,
  Heading,
  Badge,
  Skeleton,
} from '@chakra-ui/react';
import { Transaction } from '@prisma/client';
import ActionsIcon from '../Icons/ActionsIcon';
import DeleteIcon from '../Icons/DeleteIcon';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  fetchTransactions,
  setDeleteModalOpen,
} from '@/app/redux/features/transactionsSlice';
import { fetchCurrentUserAccounts } from '@/app/redux/features/userAccountSlice';
import { useEffect } from 'react';
interface ITransactionCardProps {
  transaction: Transaction;
}

const TransactionCard = ({ transaction }: ITransactionCardProps) => {
  const { currentUserAccounts, isLoading } = useAppSelector(
    (state) => state.userAccountReducer
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUserAccounts());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(fetchTransactions());
    };
  }, [dispatch]);

  const { colorMode } = useColorMode();

  const handleDeleteTransaction = (id: number) => {
    dispatch(
      setDeleteModalOpen({ isDeleteModalOpen: true, transactionId: id })
    );
  };

  if (isLoading) {
    return <Skeleton height={'11.25rem'} isLoaded={!isLoading} />;
  }

  return (
    <Box
      mt={4}
      p={4}
      borderWidth={1}
      borderRadius='md'
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
      key={transaction.id}
      boxShadow={'md'}
      position={'relative'}
    >
      <Badge
        variant={'solid'}
        colorScheme={transaction.isIncome ? 'green' : 'red'}
        mb={2}
      >
        {transaction.isIncome ? 'Income' : 'Expense'}
      </Badge>
      <Stack>
        <Heading as={'h3'} fontSize={'lg'}>
          {transaction.description}
        </Heading>
        <Text>
          {new Date(transaction.createdAt).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
        <Text>
          Account Name:{' '}
          {currentUserAccounts &&
            currentUserAccounts.find(
              (account) => account.id === transaction.accountId
            )?.name}
        </Text>
        <Text>
          {transaction.isIncome ? '+' : '-'}${transaction.amount}
        </Text>
      </Stack>
      <Popover>
        <PopoverTrigger>
          <IconButton
            icon={<ActionsIcon />}
            aria-label='Budger actions'
            bg={'transparent'}
            width={5}
            height={5}
            position={'absolute'}
            top={2}
            right={2}
            mb={2}
          />
        </PopoverTrigger>
        <PopoverContent bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader fontWeight={'bold'} textAlign={'center'}>
            Transaction Actions
          </PopoverHeader>
          <PopoverBody>
            <Flex justifyContent={'center'} alignItems={'center'}>
              <SimpleGrid columns={1} gap={4}>
                <Flex justifyContent={'center'} alignItems={'center'}>
                  <IconButton
                    aria-label={'Delete transaction'}
                    onClick={() => handleDeleteTransaction(transaction.id)}
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
    </Box>
  );
};

export default TransactionCard;
