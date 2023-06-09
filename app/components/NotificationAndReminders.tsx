'use client';
import React, { useEffect } from 'react';
import {
  Box,
  Stack,
  Badge,
  Divider,
  useColorMode,
  Button,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setIsCreateReminderModalOpen,
  setIsEditReminderModalOpen,
} from '../redux/features/remindersSlice';
import { fetchReminders } from '../redux/features/remindersSlice';
import EditIcon from './Icons/EditIcon';

const NotificationsAndReminders = () => {
  const { colorMode } = useColorMode();

  const {
    isCreateReminderModalOpen,
    isEditReminderModalOpen,
    reminders,
    isLoading,
  } = useAppSelector((state) => state.remindersReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchReminders());
  }, [dispatch]);

  if (!isLoading && !reminders) {
    return (
      <Box>
        <Text>No reminders were found.</Text>
        <Text>Get started by creating a reminder.</Text>
        <Button
          mt={3}
          bg={colorMode === 'light' ? 'blue.300' : 'gray.700'}
          border={colorMode === 'light' ? 'none' : '1px solid'}
          borderColor={colorMode === 'light' ? 'none' : 'blue.600'}
          color={'blue.50'}
          _hover={{
            bg: colorMode === 'light' ? 'blue.200' : 'gray.600',
          }}
          onClick={() => {
            dispatch(setIsCreateReminderModalOpen(!isCreateReminderModalOpen));
          }}
        >
          Create a reminder
        </Button>
      </Box>
    );
  }

  let today = new Date();

  return (
    <Box>
      <Stack spacing={4}>
        {reminders &&
          reminders.map((reminder) => (
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'flex-start'}
              flexDirection={'column'}
              key={reminder.id}
              gap={1}
              p={4}
              bg={colorMode === 'light' ? 'white' : 'gray.700'}
              rounded={'md'}
              shadow={'xl'}
              position={'relative'}
            >
              <Text fontWeight='bold'>
                {reminder.title}
                <Badge ml={2} colorScheme='blue'>
                  Reminder
                </Badge>
              </Text>
              {today < new Date(reminder.reminderDate) ? null : (
                <Badge
                  position={'absolute'}
                  bottom={1}
                  right={1}
                  colorScheme='red'
                >
                  PAST REMINDER DATE
                </Badge>
              )}
              <IconButton
                icon={<EditIcon />}
                aria-label='edit notification'
                bg={'transparent'}
                position={'absolute'}
                top={0}
                right={0}
                onClick={() => {
                  dispatch(
                    setIsEditReminderModalOpen({
                      isEditReminderModalOpen: !isEditReminderModalOpen,
                      selectedReminderId: reminder.id,
                    })
                  );
                }}
              />
              <Text fontSize='sm'>
                Date:{' '}
                {new Date(reminder.reminderDate).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                })}
              </Text>
              <Text
                fontSize={'md'}
                color={reminder.isIncome ? 'green.500' : 'red.500'}
              >
                {reminder.isIncome ? 'Income' : 'Expense'}: ${reminder.amount}
              </Text>
              <Divider my={2} />
            </Box>
          ))}
      </Stack>
      <Button
        mt={3}
        bg={colorMode === 'light' ? 'blue.300' : 'gray.700'}
        border={colorMode === 'light' ? 'none' : '1px solid'}
        borderColor={colorMode === 'light' ? 'none' : 'blue.600'}
        color={'blue.50'}
        _hover={{
          bg: colorMode === 'light' ? 'blue.200' : 'gray.600',
        }}
        onClick={() =>
          dispatch(setIsCreateReminderModalOpen(!isCreateReminderModalOpen))
        }
      >
        Create a reminder
      </Button>
    </Box>
  );
};

export default NotificationsAndReminders;
