'use client';
import {
  Box,
  Flex,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  useDisclosure,
  useColorMode,
  Switch,
  Text,
} from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import Logo from './Logo.svg';
import Image from 'next/image';
import UserMenu from './UserMenu';

const NAV_LINKS = [
  { name: 'Dashboard', href: '/' },
  { name: 'Accounts', href: '/accounts' },
  { name: 'Budgets', href: '/budgets' },
  { name: 'Goals', href: '/goals' },
  { name: 'Transactions', href: '/transactions' },
  { name: 'Reports', href: '/reports' },
];

const Navigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box mb={6} boxShadow={'lg'} rounded={'md'} p={4}>
      <Flex justify='space-between' align='center'>
        <IconButton
          icon={<HamburgerIcon />}
          aria-label='Menu'
          variant='ghost'
          onClick={onOpen}
          display={{ base: 'block', lg: 'none' }}
        />
        <Link href={'/'}>
          <Image
            src={Logo}
            alt='Cash Stash'
            width={185}
            style={{
              filter:
                colorMode === 'light' ? 'brightness(0)' : 'brightness(10)',
            }}
          />
        </Link>
        <Flex display={{ base: 'none', lg: 'flex' }}>
          {NAV_LINKS.map((link) => (
            <Link className='nav-link' key={link.name} href={link.href} mr={4}>
              {link.name}
            </Link>
          ))}
        </Flex>
        <Flex justifyContent={'center'} alignItems={'center'} gap={4}>
          <IconButton
            onClick={toggleColorMode}
            aria-label='Toggle color mode'
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            bg={'transparent'}
            _hover={{ bg: colorMode === 'light' ? 'gray.200' : 'gray.700' }}
            color={colorMode === 'light' ? 'gray.600' : 'yellow.400'}
            rounded={'md'}
            display={{ base: 'none', md: 'block' }}
          />
          <UserMenu />
        </Flex>
      </Flex>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <Switch
              onChange={toggleColorMode}
              aria-label='Toggle color mode'
              position={'relative'}
              size={'lg'}
              colorScheme={colorMode === 'light' ? 'gray' : 'yellow'}
              mb={4}
              display={{ base: 'inline-block', md: 'none' }}
            >
              {colorMode === 'light' ? (
                <MoonIcon
                  position={'absolute'}
                  right={3}
                  top={1.5}
                  color={'gray.700'}
                />
              ) : (
                <SunIcon
                  position={'absolute'}
                  left={1.5}
                  top={1.5}
                  color={'yellow.500'}
                />
              )}
            </Switch>
            <Stack spacing={4}>
              {NAV_LINKS.map((link) => (
                <Link key={link.name} href={link.href}>
                  {link.name}
                </Link>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navigation;
