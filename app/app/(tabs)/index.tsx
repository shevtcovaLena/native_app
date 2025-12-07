import React from 'react';

import { SwipeTabsContainer } from '@/src/components/SwipeTabsContainer';
import { TAB_ORDER } from '@/src/constants/tabs';
import { HomeScreen } from '@/src/screens/HomeScreen';

export default function Index() {
  return (
    <SwipeTabsContainer activeRoute="index" order={TAB_ORDER}>
      <HomeScreen />
    </SwipeTabsContainer>
  );
}

