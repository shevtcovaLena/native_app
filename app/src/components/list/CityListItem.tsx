import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { DarkThemeColors, LightThemeColors } from "@/src/theme/colors";
import { getCardBackgroundColor, getCardItemBackgroundColor } from "@/src/utils/cardColors";

import type { City } from "@/src/types/weather";

interface CityListItemProps {
  city: City;
  isSelected: boolean;
  isCurrentLocation: boolean;
  onPress: (city: City) => void;
  onDelete: (cityId: string, cityName: string) => void;
  backgroundColor?: string;
  isDarkTheme?: boolean;
}

export const CityListItem: React.FC<CityListItemProps> = ({
  city,
  isSelected,
  isCurrentLocation,
  onPress,
  onDelete,
  backgroundColor,
  isDarkTheme,
}) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DarkThemeColors : LightThemeColors;
  
  // Используем переданный backgroundColor или fallback на colors.surface
  const cardBg = backgroundColor 
    ? getCardBackgroundColor(backgroundColor)
    : colors.surface;
  
  // Для выбранного элемента используем акцентный цвет, иначе цвет карточки
  const itemBg = isSelected 
    ? colors.accent + "20" 
    : cardBg;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: itemBg,
          borderColor: isSelected ? colors.accent : "transparent",
        },
      ]}
      onPress={() => onPress(city)}
    >
      <View style={styles.cityInfo}>
        {isCurrentLocation && (
          <MaterialIcons
            name="my-location"
            size={20}
            color={colors.accent}
            style={styles.locationIcon}
          />
        )}
        <View style={styles.cityTextContainer}>
          <Text style={[styles.cityName, { color: colors.textPrimary }]}>
            {city.name}
          </Text>
          {city.country && (
            <Text style={[styles.cityCountry, { color: colors.textSecondary }]}>
              {city.country}
            </Text>
          )}
        </View>
      </View>

      {isSelected && (
        <MaterialIcons name="check-circle" size={24} color={colors.accent} />
      )}

      {!isCurrentLocation && (
        <TouchableOpacity
          onPress={() => onDelete(city.id, city.name)}
          style={styles.deleteButton}
        >
          <MaterialIcons name="delete-outline" size={24} color={colors.error} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  cityInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIcon: {
    marginRight: 12,
  },
  cityTextContainer: {
    flex: 1,
  },
  cityName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cityCountry: {
    fontSize: 14,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4,
  },
});
