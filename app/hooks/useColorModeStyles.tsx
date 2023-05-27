import { useColorMode } from '@chakra-ui/react';

export default function useColorModeStyles() {
  const { colorMode } = useColorMode();
  const headingColor = colorMode === 'light' ? 'gray.700' : 'gray.200';
  const textColor = colorMode === 'light' ? 'gray.500' : 'gray.300';
  const btnColor = colorMode === 'light' ? 'gray.800' : 'gray.200';
  const btnBgColor = colorMode === 'light' ? 'gray.200' : 'gray.800';
  const btnHoverBgColor = colorMode === 'light' ? 'gray.300' : 'black';

  return { headingColor, textColor, btnColor, btnBgColor, btnHoverBgColor };
}
