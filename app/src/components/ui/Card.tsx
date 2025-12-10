import React from 'react';
import { View, StyleSheet, ViewStyle, useColorScheme } from 'react-native';
import { DarkThemeColors, LightThemeColors } from '@/src/theme/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  padding?: number;
  borderRadius?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  backgroundColor,
  padding = 16,
  borderRadius = 12,
}) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkThemeColors : LightThemeColors;

  const cardBackgroundColor = backgroundColor || colors.surface;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardBackgroundColor,
          padding,
          borderRadius,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // Базовые стили применяются через props
  },
});

