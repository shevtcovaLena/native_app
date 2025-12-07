import type { City } from '@/src/types/weather';

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string; // Регион/область
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

export const geocodingAPI = {
  /**
   * Поиск городов по названию
   * @param name - Название города для поиска
   * @param count - Количество результатов (по умолчанию 10)
   * @param language - Язык ответа (по умолчанию ru)
   */
  searchCities: async (
    name: string,
    count: number = 10,
    language: string = 'ru'
  ): Promise<City[]> => {
    if (!name || name.trim().length === 0) {
      return [];
    }

    try {
      const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
      url.searchParams.append('name', name.trim());
      url.searchParams.append('count', count.toString());
      url.searchParams.append('language', language);
      url.searchParams.append('format', 'json');

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GeocodingResponse = await response.json();

      if (!data.results || data.results.length === 0) {
        return [];
      }

      // Преобразуем результаты в формат City
      return data.results.map((result) => ({
        id: `city-${result.id}`,
        name: result.name,
        country: result.country,
        countryCode: result.country_code,
        region: result.admin1,
        latitude: result.latitude,
        longitude: result.longitude,
      }));
    } catch (error) {
      console.error('Ошибка поиска городов:', error);
      throw new Error('Не удалось выполнить поиск городов');
    }
  },
};
