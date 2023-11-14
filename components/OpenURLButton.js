import React, { useCallback } from "react";
import {
    Alert,
    Linking,
    StyleSheet,
    TouchableOpacity,
    Text,
} from "react-native";

export const OpenURLButton = ({ url, txt }) => {
    const handlePress = useCallback(async () => {
        // Checking if the link is supported for links with custom URL scheme.
        try {
            var supported = await Linking.canOpenURL(url);
        } catch (err) {
            console.log(err);
        }

        if (supported) {
            // Opening the link with some app, if the URL scheme is "http" the web link should be opened
            // by some browser in the mobile
            await Linking.openURL(url);
        } else {
            Alert.alert(`cannot open this URL: ${url}`);
        }
    }, [url]);

    return (
        <>
            <Text
                style={[
                    styles.textSign,
                    {
                        fontSize: 16,
                        width: "90%",
                    },
                ]}
            >
                {txt}
            </Text>
			<TouchableOpacity
                    onPress={handlePress}
                    style={{
                        width: "90%",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={[
                            styles.textSign,
                            {
                                color: "red",
                            },
                        ]}
                    >
                        {url}
                    </Text>
                </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    textSign: {
        fontSize: 14,
        fontWeight: "bold",
    },
});
