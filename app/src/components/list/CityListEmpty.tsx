import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { DarkThemeColors, LightThemeColors } from "@/src/theme/colors";

export const CityListEmpty: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DarkThemeColors : LightThemeColors;

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="location-off"
        size={64}
        color={colors.textSecondary}
      />
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        Нет сохраненных городов
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  text: {
    fontSize: 16,
    marginTop: 16,
  },
});
