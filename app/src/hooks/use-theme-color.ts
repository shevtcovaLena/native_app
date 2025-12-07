// src/hooks/useThemeColors.ts
import { useColorScheme } from 'react-native';
import { DarkThemeColors, LightThemeColors } from '@/src/theme/colors';

export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? DarkThemeColors : LightThemeColors;
};
