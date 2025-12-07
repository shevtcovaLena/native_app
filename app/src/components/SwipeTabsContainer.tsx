// src/components/SwipeTabsContainer.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';

type TabName = 'index' | 'cities';

type Props = {
  activeRoute: TabName;
  order: readonly TabName[];
  children: React.ReactNode;
};

// Правильные пути для табов
const TAB_PATHS: Record<TabName, Href> = {
  index: '/(tabs)' as Href,  // ← ИСПРАВЛЕНО: без /index
  cities: '/(tabs)/cities' as Href,
};

export const SwipeTabsContainer: React.FC<Props> = ({ 
  activeRoute, 
  order, 
  children 
}) => {
  const router = useRouter();
  const translateX = useSharedValue(0);

  const navigateToTab = (tabName: TabName) => {
    const path = TAB_PATHS[tabName];
    router.push(path);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Ограничиваем сдвиг для визуального эффекта
      const maxTranslation = 100;
      translateX.value = Math.max(
        -maxTranslation,
        Math.min(maxTranslation, event.translationX * 0.5)
      );
    })
    .onEnd((event) => {
      const { translationX: tx, velocityX } = event;
      
      const threshold = 50;
      const velocityThreshold = 500;

      const currentIndex = order.indexOf(activeRoute);
      let shouldNavigate = false;
      let targetTab: TabName | null = null;

      // Свайп влево -> следующий таб
      if ((tx < -threshold || velocityX < -velocityThreshold) && 
          currentIndex < order.length - 1) {
        targetTab = order[currentIndex + 1];
        shouldNavigate = true;
      }

      // Свайп вправо -> предыдущий таб
      if ((tx > threshold || velocityX > velocityThreshold) && 
          currentIndex > 0) {
        targetTab = order[currentIndex - 1];
        shouldNavigate = true;
      }

      // Анимация возврата
      translateX.value = withSpring(0, { damping: 20 });

      // Навигация
      if (shouldNavigate && targetTab) {
        runOnJS(navigateToTab)(targetTab);
      }
    })
    .simultaneousWithExternalGesture();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
