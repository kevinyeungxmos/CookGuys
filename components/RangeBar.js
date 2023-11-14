import {
    StyleSheet,
    Text,
    View,
    Platform,
    StatusBar,
    Pressable,
} from "react-native";

export const RangeBar = ({ ...props }) => {
    return (
        <View
            style={{
                position: "absolute",
                flexDirection: "row",
                marginTop: 45,
                width: "90%",
            }}
        >
            <Pressable style={[styles.btn]} onPress={props.onPressSmall}>
                <Text style={[styles.btnLabel]}>5Km</Text>
            </Pressable>

            <Pressable style={[styles.btn]} onPress={props.onPressMedium}>
                <Text style={[styles.btnLabel]}>10Km</Text>
            </Pressable>
            <Pressable style={[styles.btn]} onPress={props.onPressLarge}>
                <Text style={[styles.btnLabel]}>15Km</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    btn: {
        borderWidth: 1,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        paddingVertical: 2,
        paddingHorizontal: 10,
        marginVertical: 10,
        marginHorizontal: 5,
        backgroundColor: "#DAFFFF",
        borderColor: "#DAFFFF",
        height: "80%",
        shadowColor: "gray",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    btnLabel: {
        fontSize: 16,
        color: "black",
    },
});
