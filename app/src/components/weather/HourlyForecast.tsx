import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import type { HourlyForecastItem } from '@/src/types/weather';
import { formatHourlyTime, isToday } from '@/src/utils/forecastUtils';
import { getWeatherCondition } from '@/src/utils/weatherCodeMapper';
import { getCardBackgroundColor } from '@/src/utils/cardColors';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  timezone?: string;
  textColor: string;
  subtitleColor: string;
  backgroundColor: string;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  timezone,
  textColor,
  subtitleColor,
  backgroundColor,
}) => {
  // Берем ближайшие 24 часа
  const next24Hours = hourly.slice(0, 24);

  if (next24Hours.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: getCardBackgroundColor(backgroundColor) }]}>
      <Text style={[styles.title, { color: textColor }]}>Почасовой прогноз</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {next24Hours.map((item, index) => {
          const time = formatHourlyTime(item.time, timezone);
          const isTodayTime = isToday(item.time, timezone);
          const condition = getWeatherCondition(item.conditionCode);

          return (
            <View key={`${item.time}-${index}`} style={styles.hourItem}>
              <Text style={[styles.hourTime, { color: subtitleColor }]}>
                {isTodayTime && index === 0 ? 'Сейчас' : time}
              </Text>
              <Text style={[styles.hourTemp, { color: textColor }]}>
                {Math.round(item.temperature)}°
              </Text>
              {item.precipitationProbability > 0 && (
                <Text style={[styles.precipitation, { color: subtitleColor }]}>
                  {item.precipitationProbability}%
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
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
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  scrollContent: {
    paddingRight: 16,
  },
  hourItem: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 60,
  },
  hourTime: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  hourTemp: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  precipitation: {
    fontSize: 10,
  },
});

