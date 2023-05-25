'use client';
import React from 'react';
import {
  Box,
  Text,
  Stack,
  Badge,
  Divider,
  useColorMode,
} from '@chakra-ui/react';

const NotificationsAndReminders = () => {
  const { colorMode } = useColorMode();
  const notifications = [
    { id: 1, title: 'Payment Due', date: '2022-06-30', amount: -500 },
    { id: 2, title: 'Upcoming Event', date: '2022-07-15', amount: 100 },
    { id: 3, title: 'Deadline Reminder', date: '2022-08-10', amount: 50 },
  ];

  return (
    <Box>
      <Stack spacing={4}>
        {notifications.map((notification) => (
          <Box
            key={notification.id}
            p={4}
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            rounded={'md'}
            shadow={'xl'}
          >
            <Text fontWeight='bold'>
              {notification.title}
              <Badge ml={2} colorScheme='blue'>
                Reminder
              </Badge>
            </Text>
            <Text fontSize='sm'>{notification.date}</Text>
            <Text fontSize={'md'}>
              {notification.amount > 0 ? 'Income' : 'Expense'}: $
              {notification.amount}
            </Text>
            <Divider my={2} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default NotificationsAndReminders;
