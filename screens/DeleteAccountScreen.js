import { Alert, Text } from "react-native";
import { useState } from "react";
import { Foundation } from "@expo/vector-icons";

import Background from "../components/Background";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import TextInput from "../components/TextInput";

import { deleteAccount } from "../context/authContext";
import {
  STR_ERROR,
  STR_SUCCESS,
  STR_PASSWORD,
  STR_ACCOUNT_DELETED,
  STR_DELETE_ACCOUNT,
  STR_DELETE_ACCT_CONFIRMATION,
  STR_DELETE,
  STR_CANCEL,
  STR_CONFIRMATION,
} from "../constants/constants";

const UpdatePasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [hasAgreed, setHasAgreed] = useState(false);

  const onConfirmPressed = async () => {
    try {
      await deleteAccount(password);
      Alert.alert(STR_SUCCESS, STR_ACCOUNT_DELETED);
    } catch (err) {
      Alert.alert(STR_ERROR, err.desc);
    }
  };

  const onDeletePressed = () => {
    Alert.alert(STR_CONFIRMATION, STR_DELETE_ACCT_CONFIRMATION, [
      { text: STR_CANCEL, style: "cancel" },
      { text: STR_DELETE, onPress: () => onConfirmPressed() },
    ]);
  };

  return (
    <Background inputMode>
      <Foundation name="alert" size={150} color="red" />

      <Text style={{ fontSize: 18 }}>
        Deleting your account is permanent. When you delete your Cook Guys
        account, your profile and all records will be permanently removed. You
        will no longer be able to login using this email unless you create a new
        account. Your current password is required for proceeding to account
        deletion.
      </Text>

      <Checkbox
        label="I understand and agree to delete my account"
        value={hasAgreed}
        onValueChange={setHasAgreed}
      />

      <TextInput
        value={password}
        onChangeText={(value) => setPassword(value)}
        placeholder={STR_PASSWORD}
        textContentType="password"
        secureTextEntry={true}
      />

      <Button
        onPress={onDeletePressed}
        label={STR_DELETE_ACCOUNT}
        disabled={!hasAgreed || !password}
      />
    </Background>
  );
};

export default UpdatePasswordScreen;
