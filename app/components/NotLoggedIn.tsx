'use client';

import { Link } from '@chakra-ui/next-js';
import { Box, Button, ButtonGroup, Heading, Stack } from '@chakra-ui/react';

const NotLoggedIn = () => {
  return (
    <Box w={'100%'} h={'100vh'}>
      <Stack>
        <Heading>You are not logged in</Heading>
        <ButtonGroup>
          <Button>
            <Link href={'/login'}>Log in</Link>
          </Button>
          <Button>
            <Link href={'/signup'}>Sign up</Link>
          </Button>
        </ButtonGroup>
      </Stack>
    </Box>
  );
};

export default NotLoggedIn;
