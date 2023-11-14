import { TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { SCREEN_SETTING } from "../constants/constants";
import { useNavigation } from "@react-navigation/native";

const SettingButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => navigation.navigate(SCREEN_SETTING)}
    >
      <AntDesign name="setting" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default SettingButton;

const styles = StyleSheet.create({
  btn: {
    marginHorizontal: 10,
  },
});
