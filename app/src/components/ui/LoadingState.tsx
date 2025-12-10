import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import { DarkThemeColors, LightThemeColors } from '@/src/theme/colors';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  minHeight?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Загрузка...',
  size = 'large',
  minHeight,
}) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkThemeColors : LightThemeColors;

  return (
    <View style={[styles.container, minHeight !== undefined && { minHeight }]}>
      <ActivityIndicator size={size} color={colors.accent} />
      {message && (
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
  },
});

