import Background from "../components/Background";
import Button from "../components/Button";
import { Alert } from "react-native";
import { logout } from "../context/authContext";
import {
  SCREEN_DELETE_ACCOUNT,
  SCREEN_UPDATE_PASSWORD,
  STR_CANCEL,
  STR_DELETE_ACCOUNT,
  STR_LOGOUT,
  STR_LOGOUT_CONFIRMATION,
  STR_UPDATE_PASSWORD,
} from "../constants/constants";

const SettingScreen = ({ navigation }) => {
  const signOut = async () => {
    try {
      logout();
    } catch (err) {
      Alert.alert(STR_ERROR, err.desc);
    }
  };

  return (
    <Background>
      <Button
        onPress={() => navigation.navigate(SCREEN_UPDATE_PASSWORD)}
        label={STR_UPDATE_PASSWORD}
      />

      <Button
        onPress={() => navigation.navigate(SCREEN_DELETE_ACCOUNT)}
        label={STR_DELETE_ACCOUNT}
      />

      <Button
        onPress={() =>
          Alert.alert(STR_LOGOUT, STR_LOGOUT_CONFIRMATION, [
            { text: STR_CANCEL, style: "cancel" },
            { text: STR_LOGOUT, onPress: () => signOut() },
          ])
        }
        label={STR_LOGOUT}
      />
    </Background>
  );
};

export default SettingScreen;
