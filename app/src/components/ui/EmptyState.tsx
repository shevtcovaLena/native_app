import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DarkThemeColors, LightThemeColors } from '@/src/theme/colors';

interface EmptyStateProps {
  icon?: keyof typeof MaterialIcons.glyphMap;
  message: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  message,
  description,
}) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkThemeColors : LightThemeColors;

  return (
    <View style={styles.container}>
      <MaterialIcons
        name={icon}
        size={64}
        color={colors.textSecondary}
      />
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
      {description && (
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  message: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

