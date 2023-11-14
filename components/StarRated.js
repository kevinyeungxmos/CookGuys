import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const StarRated = ({ stars }) => {
    const starRatingOptions = [1, 2, 3, 4, 5];

    return (
        <View style={{ flex: 1 }}>
            <View style={[styles.container]}>
                <Text style={styles.heading}>{`Your rating: ${stars}`}</Text>
                <View style={styles.stars}>
                    {starRatingOptions.map((option) => (
                        <View key={option}>
                            <MaterialIcons
                                name={
                                    stars >= option
                                        ? "star"
                                        : "star-border"
                                }
                                size={32}
                                style={[
                                    stars >= option
                                        ? styles.starSelected
                                        : styles.starUnselected,
                                    { marginLeft: 5 },
                                ]}
                            />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5deb3",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    heading: {
        fontSize: 16,
        fontWeight: "bold",
        color: "blue",
        marginBottom: 20,
    },
    stars: {
        display: "flex",
        flexDirection: "row",
    },
    starUnselected: {
        color: "#aaa",
    },
    starSelected: {
        color: "#FFFF00",
    },
});
