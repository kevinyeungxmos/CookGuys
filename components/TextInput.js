import { StyleSheet, View, TextInput as Input } from "react-native";

const TextInput = ({ icon, autoCapitalize, autoCorrect, ...props }) => {
  return (
    <View style={styles.container}>
      {icon}
      <Input
        style={styles.textInput}
        autoCapitalize={autoCapitalize ?? "none"}
        autoCorrect={autoCorrect ?? false}
        {...props}
      />
    </View>
  );
};

export default TextInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#efefef",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
});
