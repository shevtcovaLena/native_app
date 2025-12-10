import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { DailyForecastItem } from '@/src/types/weather';
import { formatDailyDate } from '@/src/utils/forecastUtils';
import { getWeatherIcon } from '@/src/utils/weatherCodeMapper';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  timezone?: string;
  textColor: string;
  subtitleColor: string;
  backgroundColor: string;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  daily,
  timezone,
  textColor,
  subtitleColor,
  backgroundColor,
}) => {
  if (daily.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Прогноз на 7 дней</Text>
      {daily.map((item, index) => {
        const date = formatDailyDate(item.date, timezone);
        const isToday = index === 0;

        return (
          <View
            key={`${item.date}-${index}`}
            style={[
              styles.dayItem,
              index < daily.length - 1 && styles.dayItemBorder,
              { borderColor: subtitleColor + '20' },
            ]}
          >
            <View style={styles.dayInfo}>
              <View style={styles.dayHeader}>
                <Text style={[styles.dayDate, { color: textColor }]}>
                  {isToday ? 'Сегодня' : date}
                </Text>
                <MaterialIcons
                  name={getWeatherIcon(item.condition)}
                  size={20}
                  color={subtitleColor}
                  style={styles.weatherIcon}
                />
              </View>
            </View>
            <View style={styles.dayInfo}>
              {item.precipitationSum > 0 && (
                <Text style={[styles.precipitation, { color: subtitleColor }]}>
                  💧 {item.precipitationSum.toFixed(1)}мм
                </Text>
              )}
            </View>
            <View style={styles.dayTemps}>
              <Text style={[styles.dayTempMax, { color: textColor }]}>
                {Math.round(item.maxTemperature)}°
              </Text>
              <Text style={[styles.dayTempMin, { color: subtitleColor }]}>
                {Math.round(item.minTemperature)}°
              </Text>
            </View>
          </View>
        );
      })}
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
  dayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dayItemBorder: {
    borderBottomWidth: 1,
  },
  dayInfo: {
    flex: 1,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayDate: {
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  weatherIcon: {
    marginTop: 2,
  },
  dayTemps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayTempMax: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  dayTempMin: {
    fontSize: 16,
    minWidth: 40,
    textAlign: 'right',
  },
  precipitation: {
    fontSize: 12,
    marginLeft: 8,
  },
});

