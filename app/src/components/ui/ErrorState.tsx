import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DarkThemeColors, LightThemeColors } from '@/src/theme/colors';

interface ErrorStateProps {
  message: string;
  minHeight?: number;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  minHeight,
}) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkThemeColors : LightThemeColors;

  return (
    <View style={[styles.container, minHeight !== undefined && { minHeight }]}>
      <MaterialIcons
        name="error-outline"
        size={48}
        color={colors.error}
      />
      <Text style={[styles.message, { color: colors.error }]}>
        {message}
      </Text>
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
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 24,
  },
});

