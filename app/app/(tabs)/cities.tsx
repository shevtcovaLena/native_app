import { SwipeTabsContainer } from "@/src/components/SwipeTabsContainer";
import { TAB_ORDER } from "@/src/constants/tabs";
import { CitiesScreen } from "@/src/screens/CitiesScreen";

export default function Cities() {
  return (
    <SwipeTabsContainer activeRoute="cities" order={TAB_ORDER}>
      <CitiesScreen />
    </SwipeTabsContainer>
  );
}
