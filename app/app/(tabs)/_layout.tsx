import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { DarkThemeColors, LightThemeColors } from '@/src/theme/colors';
import { useInitializeDefaultCity } from '@/src/hooks/use-initialize-default-city';
import { useNotifications } from '@/src/hooks/use-notifications';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? DarkThemeColors : LightThemeColors;

  useInitializeDefaultCity();
  useNotifications();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: isDark ? '#1e293b' : '#e2e8f0',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Погода',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="wb-sunny" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cities"
        options={{
          title: 'Города',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="location-city" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

