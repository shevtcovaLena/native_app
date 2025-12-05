// Базовая палитра и light/dark темы для приложения погоды
// Можно расширять по мере добавления новых экранов

export const Palette = {
  // Базовые оттенки
  blue: {
    400: "#60a5fa",
  },
  slate: {
    900: "#0f172a",
    400: "#9ca3af",
    100: "#e5e7eb",
    50: "#f9fafb",
  },
  orange: {
    400: "#f97316",
  },
} as const;

export const LightThemeColors = {
  /** Цвет текста по умолчанию */
  textPrimary: "#11181C",
  /** Вторичный текст (подзаголовки, описания) */
  textSecondary: "#687076",
  /** Цвет фона экрана */
  background: "#ffffff",
  /** Цвет фона карточек / секций */
  surface: "#f3f4f6",
  /** Основной акцент (кнопки, ссылки, индикаторы) */
  accent: Palette.blue[400],
  /** Цвет ошибки / предупреждений */
  error: Palette.orange[400],
} as const;

export const DarkThemeColors = {
  textPrimary: Palette.slate[50],
  textSecondary: Palette.slate[400],
  background: Palette.slate[900],
  surface: "#020617",
  accent: Palette.blue[400],
  error: Palette.orange[400],
} as const;

export type AppTheme = {
  colors: typeof LightThemeColors;
};

export const LightTheme: AppTheme = {
  colors: LightThemeColors,
};

export const DarkTheme: AppTheme = {
  colors: DarkThemeColors,
};


