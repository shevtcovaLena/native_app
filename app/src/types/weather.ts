export enum WeatherCondition {
  Clear = 'clear',
  PartlyCloudy = 'partly_cloudy',
  Cloudy = 'cloudy',
  Fog = 'fog',
  Drizzle = 'drizzle',
  Rain = 'rain',
  Snow = 'snow',
  Showers = 'showers',
  Thunderstorm = 'thunderstorm',
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  conditionCode: number;
  condition: WeatherCondition;
}

export interface DailyForecastItem {
  date: string;
  minTemperature: number;
  maxTemperature: number;
  precipitationSum: number;
  conditionCode: number;
  condition: WeatherCondition;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  precipitationProbability: number;
  conditionCode: number;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  cityName?: string;
}

export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  timezone?: string;
  countryCode?: string;
  region?: string;
}


