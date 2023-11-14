import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import { Bar as ProgressBar } from "react-native-progress";

const { width } = Dimensions.get("window");

const ProfileHeader = ({ name, level, exp }) => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.labelName}>{name}</Text>

        <View>
          <ProgressBar
            progress={exp / 100}
            width={150}
            height={15}
            color="green"
          />
          <View style={styles.expContainer}>
            <Text style={styles.labelLevel}>Lv. {level}</Text>
            <Text style={styles.labelExp}>{exp}/100</Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 100,
    borderWidth: 1,
    borderBottomRightRadius: Platform.OS === "ios" ? "100%" : 100,
    borderBottomLeftRadius: Platform.OS === "ios" ? "100%" : 100,
    borderColor: "orange",
    backgroundColor: "orange",
    alignItems: "center",
    gap: 15,
    paddingVertical: 15,
    marginBottom: 10,
  },
  labelName: {
    fontSize: 25,
    fontFamily: Platform.OS === "ios" ? "Verdana" : "Roboto",
    fontWeight: "bold",
  },
  labelLevel: {
    fontFamily: Platform.OS === "ios" ? "Verdana" : "Roboto",
    flex: 1,
    fontSize: 12,
  },
  labelExp: {
    fontFamily: Platform.OS === "ios" ? "Verdana" : "Roboto",
    fontSize: 12,
  },
  expContainer: {
    flexDirection: "row",
  },
});
