import { StyleSheet, Text, TouchableOpacity } from "react-native";

const Button = ({ label, customStyles, paddingVerticalSize, ...props }) => {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        { backgroundColor: props.disabled ? "#666" : "#24A0ED" },
        { borderColor: props.disabled ? "#C6C6C6" : "#24A0ED" },
        { paddingVertical: paddingVerticalSize ?? 16 },
        customStyles,
      ]}
      {...props}
    >
      <Text style={styles.btnLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    width: "100%",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 10,
  },
  btnLabel: {
    fontSize: 16,
    color: "#FFF",
  },
});
