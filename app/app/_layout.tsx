import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "react-native";
import { useWeatherStore } from "@/src/store/weatherStore";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const initializeStore = useWeatherStore((state) => state.initializeStore);

  const navigationTheme = isDark ? NavigationDarkTheme : NavigationDefaultTheme;
  // console.log('render layout')
  // Инициализируем store при загрузке приложения
  // useEffect(() => {
  //   void initializeStore();
  // }, [initializeStore]);

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
