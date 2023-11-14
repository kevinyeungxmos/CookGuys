import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
    STR_CANCEL,
    STR_CONFIRMATION,
    STR_OK,
    STR_FIELD_ISRATED,
    STR_FIELD_RATINGSTAR,
    STR_FIELD_STATUS,
    STR_NO,
} from "../constants/constants";
import { updateReservation, updateExp, cancelAppointment } from "../context/accountInfoContext";

export const StarRating = ({ cook, id, refreshParent, cookID, mode, userID }) => {
    const starRatingOptions = [1, 2, 3, 4, 5];

    const [starRating, setStarRating] = useState(0);

    const animatedButtonScale = new Animated.Value(1);

    const handlePressIn = (option) => {
        Animated.spring(animatedButtonScale, {
            toValue: 1.5,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = (option) => {
        Animated.spring(animatedButtonScale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    const animatedScaleStyle = {
        transform: [{ scale: animatedButtonScale }],
    };

    const setToZero = () => {
        setStarRating(0);
    };

    const onButtonPressed = async (star, cookName) => {
        Alert.alert(STR_CONFIRMATION, `you give ${star} stars to ${cookName}`, [
            { text: STR_CANCEL, style: "cancel" },
            {
                text: STR_OK,
                onPress: async () => {
                    await updateReservation({
                        [STR_FIELD_ISRATED]: true,
                        [STR_FIELD_RATINGSTAR]: star,
                        [STR_FIELD_STATUS]: "Finished"
                    }, id);
                    await updateExp(cookID, star)
                    await refreshParent();
                },
            },
        ]);
    };

    const onCancelPressed = async (mode, cook, id, userid, cookid) => {
        Alert.alert(STR_CONFIRMATION, `Are you sure about canceling this appointment? ${mode} meeting with ${cook}`, [
            { text: STR_NO, style: "cancel" },
            {
                text: STR_CANCEL,
                onPress: async () => {
                    await cancelAppointment(id, cookid, userid);
                    await refreshParent();
                },
            },
        ]);
    };

    return (
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={setToZero}>
            <View style={[styles.container]}>
                <Text style={styles.heading}>{`Rating: ${starRating}`}</Text>
                <View style={styles.stars}>
                    {starRatingOptions.map((option) => (
                        <TouchableWithoutFeedback
                            onPressIn={() => handlePressIn(option)}
                            onPressOut={() => handlePressOut(option)}
                            onPress={() => setStarRating(option)}
                            key={option}
                        >
                            <Animated.View style={animatedScaleStyle}>
                                <MaterialIcons
                                    name={
                                        starRating >= option
                                            ? "star"
                                            : "star-border"
                                    }
                                    size={32}
                                    style={[
                                        starRating >= option
                                            ? styles.starSelected
                                            : styles.starUnselected,
                                        { marginLeft: 5 },
                                    ]}
                                />
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    ))}
                </View>
                <TouchableOpacity
                    onPress={() => {
                        onButtonPressed(starRating, cook);
                    }}
                    style={[
                        styles.btnSubmit,
                        {
                            borderColor: "red",
                            borderWidth: 1,
                            marginTop: 10,
                            marginBottom: -10,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.textSign,
                            {
                                color: "red",
                            },
                        ]}
                    >
                        Submit
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        onCancelPressed(mode, cook, id, userID, cookID);
                    }}
                    style={[
                        styles.btnSubmit,
                        {
                            borderColor: "red",
                            borderWidth: 1,
                            marginTop: 20,
                            marginBottom: -10,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.textSign,
                            {
                                color: "red",
                            },
                        ]}
                    >
                        Cancel
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
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
    textSign: {
        fontSize: 14,
        fontWeight: "bold",
    },
    btnSubmit: {
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 3,
        width: 100,
    },
});
