import ExpoCheckbox from "expo-checkbox";
import { StyleSheet, Text, View } from "react-native";

const Checkbox = ({ label, ...props }) => {
  return label ? (
    <View style={styles.container}>
      <ExpoCheckbox style={styles.checkbox} {...props} />
      <Text style={styles.label}>{label}</Text>
    </View>
  ) : (
    <ExpoCheckbox {...props} />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  checkbox: {
    marginHorizontal: 10,
  },
});

export default Checkbox;
