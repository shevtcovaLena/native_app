import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { CurrentWeather } from '@/src/types/weather';
import { getCardBackgroundColor, getCardItemBackgroundColor } from '@/src/utils/cardColors';

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

interface WeatherDetailsProps {
  current: CurrentWeather;
  textColor: string;
  subtitleColor: string;
  backgroundColor: string;
  isDarkTheme?: boolean;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({
  current,
  textColor,
  subtitleColor,
  backgroundColor,
  isDarkTheme = false,
}) => {
  const details: {
    label: string;
    value: string;
    icon: MaterialIconName;
  }[] = [
    {
      label: 'Влажность',
      value: `${current.humidity}%`,
      icon: 'opacity',
    },
    {
      label: 'Скорость ветра',
      value: `${Math.round(current.windSpeed)} м/с`,
      icon: 'air',
    },
    // TODO: добавить ощущаемую температуру (feels_like), если будет доступна в API
    // TODO: добавить давление (pressure), если будет доступно в API
    // TODO: добавить UV индекс, если будет доступен в API
    // TODO: добавить восход/закат, если будут доступны в API
  ];

  return (
    <View style={[styles.container, { backgroundColor: getCardBackgroundColor(backgroundColor) }]}>
      <Text style={[styles.title, { color: textColor }]}>Детали</Text>
      <View style={styles.grid}>
        {details.map((detail, index) => (
          <View
            key={index}
            style={[
              styles.detailItem,
              {
                backgroundColor: getCardItemBackgroundColor(isDarkTheme),
              },
            ]}
          >
            <View style={styles.detailHeader}>
              <MaterialIcons
                name={detail.icon}
                size={20}
                color={subtitleColor}
              />
              <Text style={[styles.detailLabel, { color: subtitleColor }]}>
                {detail.label}
              </Text>
            </View>
            <Text style={[styles.detailValue, { color: textColor }]}>
              {detail.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'space-between'
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '600',
  },
});

