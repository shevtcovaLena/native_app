/**
 * Утилиты для получения цветов карточек и плашек
 * Применяет принцип DRY для единообразного стиля
 */

/**
 * Получить цвет фона для карточки/плашки с полупрозрачностью
 * @param baseColor - базовый цвет фона
 * @param opacity - прозрачность (по умолчанию "80" = 50%)
 * @returns цвет с прозрачностью
 */
export const getCardBackgroundColor = (
  baseColor: string,
  opacity: string = "80"
): string => {
  return baseColor + opacity;
};

/**
 * Получить цвет фона для внутренних элементов карточки (детали, плашки)
 * @param isDarkTheme - true если темная тема
 * @returns цвет с прозрачностью
 */
export const getCardItemBackgroundColor = (isDarkTheme: boolean): string => {
  return isDarkTheme
    ? 'rgba(255, 255, 255, 0.15)'
    : 'rgba(0, 0, 0, 0.08)';
};

