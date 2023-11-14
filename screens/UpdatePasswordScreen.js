import { useState } from "react";

import Button from "../components/Button";
import TextInput from "../components/TextInput";

import { changePassword } from "../context/authContext";
import {
  STR_CURRENT_PASSWORD,
  STR_NEW_PASSWORD,
  STR_CONFIRM_NEW_PASSWORD,
  STR_ERROR,
  STR_ERRMSG_UNMATCHED_NEW_PASSWORDS,
  STR_PASSWORD_CHANGED,
  STR_SUCCESS,
} from "../constants/constants";
import Background from "../components/Background";
import { Alert } from "react-native";

const UpdatePasswordScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    [STR_CURRENT_PASSWORD]: "",
    [STR_NEW_PASSWORD]: "",
    [STR_CONFIRM_NEW_PASSWORD]: "",
  });

  const onFormChanged = (field, newValue) => {
    const updatedForm = { ...form };
    updatedForm[field] = newValue;
    setForm(updatedForm);
  };

  const onChangePwdPressed = async () => {
    if (form[STR_NEW_PASSWORD] != form[STR_CONFIRM_NEW_PASSWORD]) {
      Alert.alert(STR_ERRMSG_UNMATCHED_NEW_PASSWORDS);
      return;
    }

    try {
      await changePassword(form[STR_CURRENT_PASSWORD], form[STR_NEW_PASSWORD]);
      Alert.alert(STR_SUCCESS, STR_PASSWORD_CHANGED, [
        { text: "Dismiss", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert(STR_ERROR, err.desc);
    }
  };

  return (
    <Background inputMode>
      <TextInput
        value={form[STR_CURRENT_PASSWORD]}
        onChangeText={(value) => onFormChanged(STR_CURRENT_PASSWORD, value)}
        placeholder={STR_CURRENT_PASSWORD}
        textContentType="password"
        secureTextEntry={true}
      />
      <TextInput
        value={form[STR_NEW_PASSWORD]}
        onChangeText={(value) => onFormChanged(STR_NEW_PASSWORD, value)}
        placeholder={STR_NEW_PASSWORD}
        textContentType="password"
        secureTextEntry={true}
      />
      <TextInput
        value={form[STR_CONFIRM_NEW_PASSWORD]}
        onChangeText={(value) => onFormChanged(STR_CONFIRM_NEW_PASSWORD, value)}
        placeholder={STR_CONFIRM_NEW_PASSWORD}
        textContentType="password"
        secureTextEntry={true}
      />
      <Button
        onPress={onChangePwdPressed}
        label="Change Password"
        disabled={
          !form[STR_CURRENT_PASSWORD] ||
          !form[STR_NEW_PASSWORD] ||
          !form[STR_CONFIRM_NEW_PASSWORD]
        }
      />
    </Background>
  );
};

export default UpdatePasswordScreen;
