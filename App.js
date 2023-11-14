import { NavigationContainer } from "@react-navigation/native";
import StackNavigations from "./navigations/StackNavigations";
import usePushNotifications from "./hooks/usePushNotifications";
import { useAuthListener } from "./hooks/useAuthListener";

export default function App() {
  const isLoggedIn = useAuthListener();

  usePushNotifications();

  return (
    <NavigationContainer>
      <StackNavigations isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );
}
