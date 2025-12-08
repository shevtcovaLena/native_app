import { useEffect, useRef } from 'react';
import { notificationService } from '@/src/services/notificationService';
import { useWeatherStore } from '@/src/store/weatherStore';

export const useNotifications = () => {
  const initialized = useWeatherStore((state) => state.initialized);
  const isScheduled = useRef(false);

  useEffect(() => {
    if (!initialized || isScheduled.current) {
      return;
    }

    const initNotifications = async () => {
      const granted = await notificationService.requestPermissions();
      
      if (granted) {
        await notificationService.scheduleMorningGreeting();
        isScheduled.current = true;
      }
    };

    void initNotifications();
  }, [initialized]);
};
