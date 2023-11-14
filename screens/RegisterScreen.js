import { Alert } from "react-native";
import { useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import Button from "../components/Button";
import TextInput from "../components/TextInput";

import { addAcctInfo } from "../context/accountInfoContext";
import { signUp } from "../context/authContext";
import {
  STR_EMAIL,
  STR_NAME,
  STR_PASSWORD,
  STR_CONFIRM_PASSWORD,
  STR_ERROR,
} from "../constants/constants";
import Background from "../components/Background";

const RegisterScreen = () => {
  const [userInfo, setUserInfo] = useState({
    [STR_NAME]: "",
    [STR_EMAIL]: "",
    [STR_PASSWORD]: "",
    [STR_CONFIRM_PASSWORD]: "",
  });

  const onFormChanged = (fieldName, newValue) => {
    const updatedFormData = { ...userInfo };
    updatedFormData[fieldName] = newValue;
    setUserInfo(updatedFormData);
  };

  const createAccount = async () => {
    try {
      // Create account in Firebase Auth
      const userId = await signUp(userInfo[STR_EMAIL], userInfo[STR_PASSWORD]);

      // Add user info to Firestore
      await addAcctInfo(userId, userInfo[STR_NAME]);
    } catch (err) {
      console.debug(err);
      Alert.alert(STR_ERROR, err.desc);
    }
  };

  return (
    <Background inputMode>
      <TextInput
        icon={<Ionicons name="person" size={24} color="black" />}
        value={userInfo[STR_NAME]}
        onChangeText={(newValue) => onFormChanged(STR_NAME, newValue)}
        placeholder={STR_NAME}
        autoCapitalize="words"
        textContentType="name"
      />
      <TextInput
        icon={<MaterialIcons name="email" size={24} color="black" />}
        value={userInfo[STR_EMAIL]}
        onChangeText={(newValue) => onFormChanged(STR_EMAIL, newValue)}
        placeholder={STR_EMAIL}
        autoCompleteType="email"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <TextInput
        icon={<Ionicons name="key-sharp" size={24} color="black" />}
        value={userInfo[STR_PASSWORD]}
        onChangeText={(newValue) => onFormChanged(STR_PASSWORD, newValue)}
        placeholder={STR_PASSWORD}
        textContentType="password"
        secureTextEntry={true}
      />
      <TextInput
        icon={<Ionicons name="key-sharp" size={24} color="black" />}
        value={userInfo[STR_CONFIRM_PASSWORD]}
        onChangeText={(newValue) =>
          onFormChanged(STR_CONFIRM_PASSWORD, newValue)
        }
        placeholder={STR_CONFIRM_PASSWORD}
        textContentType="password"
        secureTextEntry={true}
      />
      <Button
        onPress={() => createAccount()}
        label="Register"
        disabled={
          !userInfo[STR_NAME] ||
          !userInfo[STR_EMAIL] ||
          !userInfo[STR_PASSWORD] ||
          !userInfo[STR_CONFIRM_PASSWORD] ||
          userInfo[STR_PASSWORD] != userInfo[STR_CONFIRM_PASSWORD]
        }
      />
    </Background>
  );
};

export default RegisterScreen;
