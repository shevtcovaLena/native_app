import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DarkThemeColors, LightThemeColors } from '@/src/theme/colors';

interface CityListHeaderProps {
  citiesCount: number;
  onAddCity: () => void;
}

export const CityListHeader: React.FC<CityListHeaderProps> = ({ 
  citiesCount,
  onAddCity 
}) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkThemeColors : LightThemeColors;

  const getCityWord = (count: number) => {
    if (count === 1) return 'город';
    if (count < 5) return 'города';
    return 'городов';
  };

  return (
    <View style={styles.header}>
      <View>
        <Text style={[styles.title, { color: colors.textPrimary }]}> 
          Мои города
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {citiesCount} {getCityWord(citiesCount)}
        </Text>
      </View>
      <TouchableOpacity 
        onPress={onAddCity}
        style={[styles.addButton, { backgroundColor: colors.accent }]} 
      >
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
