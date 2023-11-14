import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigations from "./TabNavigations";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SettingsScreen from "../screens/SettingsScreen";
import DeleteAccountScreen from "../screens/DeleteAccountScreen";
import {
  SCREEN_DELETE_ACCOUNT,
  SCREEN_LOGIN,
  SCREEN_REGISTER,
  SCREEN_SETTING,
  SCREEN_UPDATE_PASSWORD,
  STACK_AUTHENTICATED,
} from "../constants/constants";
import UpdatePasswordScreen from "../screens/UpdatePasswordScreen";

const Stack = createNativeStackNavigator();

const StackNavigations = (props) => {
  return (
    <Stack.Navigator>
      {props.isLoggedIn ? (
        <>
          <Stack.Screen
            name={STACK_AUTHENTICATED}
            component={TabNavigations}
            options={{ headerShown: false }}
          />
          <Stack.Screen name={SCREEN_SETTING} component={SettingsScreen} />
          <Stack.Screen
            name={SCREEN_UPDATE_PASSWORD}
            component={UpdatePasswordScreen}
          />
          <Stack.Screen
            name={SCREEN_DELETE_ACCOUNT}
            component={DeleteAccountScreen}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name={SCREEN_LOGIN}
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name={SCREEN_REGISTER} component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigations;
