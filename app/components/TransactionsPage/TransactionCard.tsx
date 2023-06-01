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
} from '@chakra-ui/react';
import { Transaction } from '@prisma/client';
import ActionsIcon from '../Icons/ActionsIcon';
import EyeIcon from '../Icons/EyeIcon';
import EditIcon from '../Icons/EditIcon';
import DeleteIcon from '../Icons/DeleteIcon';

interface ITransactionCardProps {
  transaction: Transaction;
}

const TransactionCard = ({ transaction }: ITransactionCardProps) => {
  const { colorMode } = useColorMode();

  const handleEditTransaction = (id: number) => {};
  const handleDeleteTransaction = (id: number) => {};
  const handleViewTransactionDetails = (id: number) => {};

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
        {/* TODO: Display associated account name with the transaction */}
        <Text>{transaction.amount}₺</Text>
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
        <PopoverContent>
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
                    aria-label={'Edit transaction'}
                    onClick={() => handleEditTransaction(transaction.id)}
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
                <Flex justifyContent={'center'} alignItems={'center'}>
                  <IconButton
                    aria-label={'View transaction details'}
                    onClick={() => handleViewTransactionDetails(transaction.id)}
                    icon={<EyeIcon />}
                    width={5}
                    height={5}
                    bg={'transparent'}
                    mr={2}
                  />
                  <Text width={'52%'}>Details</Text>
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
