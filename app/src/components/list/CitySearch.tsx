import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  useColorScheme,
  Keyboard,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { geocodingAPI } from "@/src/services/geocodingAPI";
import { useWeatherStore } from "@/src/store/weatherStore";
import type { City } from "@/src/types/weather";
import { DarkThemeColors, LightThemeColors } from "@/src/theme/colors";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { ErrorState } from "@/src/components/ui/ErrorState";
import { EmptyState } from "@/src/components/ui/EmptyState";

// Константа для debounce
const SEARCH_DEBOUNCE_MS = 1000; // 1000ms - оптимальное значение

export const CitySearch: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? DarkThemeColors : LightThemeColors;

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(""); // ← Добавить
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCity = useWeatherStore((state) => state.addCity);
  const setCurrentCity = useWeatherStore((state) => state.setCurrentCity);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.trim().length < 2) {
        setResults([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const cities = await geocodingAPI.searchCities(debouncedQuery, 10, "ru");
        setResults(cities);

        if (cities.length === 0) {
          setError("Города не найдены");
        }
      } catch (err) {
        console.error('Ошибка поиска:', err);
        setError("Ошибка поиска. Попробуйте еще раз");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    void performSearch();
  }, [debouncedQuery]);

  // Обработчик ввода - только меняет локальное состояние
  const handleQueryChange = (text: string) => {
    setQuery(text);
    // Показываем лоадер сразу, если текст достаточной длины
    if (text.trim().length >= 2) {
      setLoading(true);
    }
  };

  const handleClearQuery = () => {
    setQuery("");
    setDebouncedQuery("");
    setResults([]);
    setError(null);
    setLoading(false);
  };

  const handleSelectCity = async (city: City) => {
    Keyboard.dismiss();
    onClose();
    
    try {
      await addCity(city);
      await setCurrentCity(city);
      // Погода загрузится автоматически через useWeatherQuery в HomeScreen
    } catch (error) {
      console.error('Ошибка добавления города:', error);
    }
  };

  const renderSearchResult = ({ item }: { item: City }) => {
    const details =
      [item.region, item.country].filter(Boolean).join(", ") ||
      "Местоположение неизвестно";

    return (
      <TouchableOpacity
        style={[
          styles.resultItem,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={() => handleSelectCity(item)}
      >
        <View style={styles.resultInfo}>
          <MaterialIcons
            name="location-on"
            size={20}
            color={colors.textSecondary}
          />
          <View style={styles.resultText}>
            <Text style={[styles.resultName, { color: colors.textPrimary }]}>
              {item.name}
            </Text>
            <Text
              style={[styles.resultDetails, { color: colors.textSecondary }]}
            >
              {details}
            </Text>
          </View>
        </View>
        <MaterialIcons name="add" size={24} color={colors.accent} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Шапка с кнопкой назад */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Добавить город
        </Text>
      </View>

      {/* Поле поиска */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <MaterialIcons name="search" size={24} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Найти город..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={handleQueryChange}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="search"
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClearQuery}>
            <MaterialIcons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Результаты поиска */}
      {loading && <LoadingState message="Поиск городов..." />}

      {error && !loading && <ErrorState message={error} />}

      {!loading && !error && results.length > 0 && (
        <FlatList
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsContainer}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {/* Подсказка если ничего не ввели */}
      {!loading && !error && results.length === 0 && query.length === 0 && (
        <EmptyState
          icon="search"
          message="Начните вводить название города"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    marginRight: 8,
  },
  resultsContainer: {
    padding: 16,
    paddingTop: 0,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  resultInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  resultText: {
    marginLeft: 12,
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  resultDetails: {
    fontSize: 14,
  },
});
