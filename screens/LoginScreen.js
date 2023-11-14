import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import Button from "../components/Button";
import TextInput from "../components/TextInput";

import { auth } from "../configs/dbConfig";
import { login } from "../context/authContext";
import {
  SCREEN_REGISTER,
  STR_EMAIL,
  STR_ERROR,
  STR_PASSWORD,
} from "../constants/constants";
import Background from "../components/Background";
import { Alert } from "react-native";

const LoginScreen = () => {
  const [credentials, setCredentials] = useState({
    [STR_EMAIL]: "",
    [STR_PASSWORD]: "",
  });

  const navigation = useNavigation();

  const onFormChanged = (field, newValue) => {
    const updatedCredentials = { ...credentials };
    updatedCredentials[field] = newValue;
    setCredentials(updatedCredentials);
  };

  const onLoginPressed = async () => {
    try {
      await login(credentials[STR_EMAIL], credentials[STR_PASSWORD]);
      console.log(`User ${auth.currentUser.uid} logged in`);
    } catch (err) {
      Alert.alert(STR_ERROR, err.desc);
    }
  };

  return (
    <Background inputMode>
      <TextInput
        icon={<MaterialIcons name="email" size={24} color="black" />}
        value={credentials[STR_EMAIL]}
        onChangeText={(value) => onFormChanged(STR_EMAIL, value)}
        placeholder={STR_EMAIL}
        autoCompleteType="email"
        keyboardType="email-address"
        textContentType="emailAddress"
      />

      <TextInput
        icon={<Ionicons name="key-sharp" size={24} color="black" />}
        value={credentials[STR_PASSWORD]}
        onChangeText={(value) => onFormChanged(STR_PASSWORD, value)}
        placeholder={STR_PASSWORD}
        textContentType="password"
        secureTextEntry={true}
      />

      <Button
        onPress={onLoginPressed}
        label="LOGIN"
        disabled={!credentials[STR_EMAIL] || !credentials[STR_PASSWORD]}
      />

      <Button
        onPress={() => navigation.navigate(SCREEN_REGISTER)}
        label="Register Account"
      />
    </Background>
  );
};

export default LoginScreen;
