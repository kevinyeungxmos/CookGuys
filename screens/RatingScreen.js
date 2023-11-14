import { View, Text, StyleSheet } from "react-native";

export const RatingScreen = () => {

    return(
        <View style={styles.container}>
            <Text>
                Rating Screen
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
});