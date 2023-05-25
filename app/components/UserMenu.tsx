'use client';
import {
  Menu,
  MenuButton,
  Button,
  Avatar,
  MenuList,
  Center,
  MenuDivider,
  MenuItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { User } from '@prisma/client';
import { signOut } from 'next-auth/react';

interface IUserMenuProps {
  user: User | null;
}

const UserMenu = ({ user }: IUserMenuProps) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded={'full'}
        variant={'link'}
        cursor={'pointer'}
        minW={0}
        bg={'transparent'}
      >
        <Avatar
          src={user?.image as string}
          name={user?.name as string}
          bg={useColorModeValue('gray.200', 'gray.700')}
          color={useColorModeValue('gray.600', 'gray.200')}
        />
      </MenuButton>
      <MenuList alignItems={'center'}>
        <br />
        <Center>
          <Avatar
            src={user?.image as string}
            name={user?.name as string}
            bg={useColorModeValue('gray.200', 'gray.700')}
            color={useColorModeValue('gray.600', 'gray.200')}
            size={'xl'}
          />
        </Center>
        <br />
        <Center>
          <p>{user?.name}</p>
        </Center>
        <br />
        <MenuDivider />
        <MenuItem>Your Servers</MenuItem>
        <MenuItem>Account Settings</MenuItem>
        <MenuItem
          onClick={() =>
            signOut({
              callbackUrl: '/login',
              redirect: true,
            })
          }
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
