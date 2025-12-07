import type { Href } from 'expo-router';

export const TAB_ORDER = ['index', 'cities'] as const;
export type TabName = typeof TAB_ORDER[number];

export const TAB_PATHS: Record<TabName, Href> = {
  index: '/(tabs)' as Href,
  cities: '/(tabs)/cities' as Href,
};
