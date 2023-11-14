import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  View,
} from "react-native";

const Background = ({ alignTop, children, inputMode }) => {
  const body = (
    <KeyboardAvoidingView
      style={
        alignTop
          ? [styles.container, { justifyContent: "baseline" }]
          : styles.container
      }
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {children}
    </KeyboardAvoidingView>
  );

  return inputMode ? (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {body}
    </TouchableWithoutFeedback>
  ) : (
    <View style={{ flex: 1, paddingVertical: 10, backgroundColor: "#FFF" }}>
      {body}
    </View>
  );
};

export default Background;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? 0 : 0,
  },
});
