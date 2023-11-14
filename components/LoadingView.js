import { ActivityIndicator, View } from "react-native";

const LoadingView = ({ size, ...props }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size={size ?? "large"} {...props} />
    </View>
  );
};

export default LoadingView;
