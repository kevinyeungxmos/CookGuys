import { Alert, StyleSheet, Text, View } from "react-native";
import Button from "./Button";
import { changeBookingStatus } from "../context/bookingContext";
import {
    STR_ACCEPT,
    STR_ACCEPTED,
    STR_CANCEL,
    STR_CONFIRMATION,
    STR_CONFIRM_CHANGE_BOOKING_STATUS,
    STR_DECLINE,
    STR_DECLINED,
    STR_ERRMSG_UPDATE_STATUS_FAILURE,
    STR_ERROR,
    STR_FIELD_COOKID,
    STR_FIELD_NAME,
    STR_FIELD_PUSH_TOKEN,
    STR_FIELD_USERID,
    STR_OK,
} from "../constants/constants";
import { useState } from "react";
import LoadingView from "./LoadingView";
import { sendPushNotificationByToken } from "../helpers/pushNotificationsHelper";
import { getAcctInfo } from "../context/accountInfoContext";
import { OpenURLButton } from "./OpenURLButton";
import { StarRating } from "./StaraRating";
import { StarRated } from "./StarRated";

const AppointmentCard = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const dateToJS = new Date(props.DateTime.seconds * 1000);

    const labelStatusColour =
        !props.status && !props.isTeaching
            ? "gray"
            : props.status === STR_ACCEPTED
            ? "blue"
            : "red";

    const dateRequested = dateToJS.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const timeRequested = dateToJS.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const onButtonPressed = async (isAccepting) => {
        Alert.alert(STR_CONFIRMATION, STR_CONFIRM_CHANGE_BOOKING_STATUS, [
            { text: STR_CANCEL, style: "cancel" },
            {
                text: STR_OK,
                onPress: () => updateBookingStatus(isAccepting),
            },
        ]);
    };

    const updateBookingStatus = async (isAccepting) => {
        try {
            setIsLoading(true);
            await changeBookingStatus(props.id, isAccepting);
            await props.refreshParent();

            // send notification to learner
            const cookInfo = await getAcctInfo(props[STR_FIELD_COOKID]);
            const learnerInfo = await getAcctInfo(props[STR_FIELD_USERID]);
            const token = learnerInfo[STR_FIELD_PUSH_TOKEN];
            const message = {
                body: `Your appointment request to ${
                    cookInfo[STR_FIELD_NAME]
                } has been ${
                    isAccepting
                        ? STR_ACCEPTED.toLowerCase()
                        : STR_DECLINED.toLowerCase()
                }`,
            };
            sendPushNotificationByToken(token, message);
        } catch (err) {
            Alert.alert(STR_ERROR, STR_ERRMSG_UPDATE_STATUS_FAILURE);
        }
        setIsLoading(false);
    };

    const ResponseButton = () => {
        return isLoading ? (
            <LoadingView size="small" style={{ marginBottom: 10 }} />
        ) : (
            <View style={styles.btnGroup}>
                <Button
                    label={STR_ACCEPT}
                    onPress={() => onButtonPressed(true)}
                    customStyles={styles.btnAccept}
                    paddingVerticalSize={10}
                />

                <Button
                    label={STR_DECLINE}
                    onPress={() => onButtonPressed(false)}
                    customStyles={styles.btnDecline}
                    paddingVerticalSize={10}
                />
            </View>
        );
    };

    const ratingCompleted = (rating) => {
        console.log("Rating is: " + rating);
    };

    return (
        <View style={styles.card}>
            <Text>
                {props.isTeaching ? "Requested by" : "Requested"}{" "}
                <Text style={styles.labelName}>{props.name}</Text>
            </Text>

            <Text style={styles.text}>
                <Text style={styles.labelEmphasise}>{props.mode}</Text> at{" "}
                <Text style={styles.labelEmphasise}>{timeRequested}</Text> on{" "}
                <Text style={styles.labelEmphasise}>{dateRequested}</Text>
            </Text>

            <Text style={styles.text}>
                Phone: <Text style={styles.labelEmphasise}>{props.phone}</Text>
            </Text>

            {props.mode == "Zoom" ? (
                <OpenURLButton url={props.zoom} txt={"Zoom: "} />
            ) : (
                <></>
            )}

            <Text style={[styles.text, styles.labelEmphasise]}>
                {props.address || "No address provided"}
            </Text>

            {props.message && (
                <>
                    <Text style={[styles.text, { fontWeight: "bold" }]}>
                        Message:
                    </Text>
                    <Text style={[styles.text, { marginTop: 5 }]}>
                        {props.message}
                    </Text>
                </>
            )}

            {!props.status && props.isTeaching ? (
                ResponseButton()
            ) : (
                <Text
                    style={[styles.labelStatus, { color: labelStatusColour }]}
                >
                    {props.status ?? "PENDING"}
                </Text>
            )}
            {(props.status == "Accepted" || props.status == "Finished") && !props.isTeaching ? (
                <>
                    {props.isRated == true ? (
                        <StarRated stars={props.stars} />
                    ) : (
                        <>
                            <Text
                                style={[
                                    styles.labelStatus,
                                    { color: labelStatusColour },
                                ]}
                            >
                                Your feedback is valuable to us. Could you
                                please leave us a review by rating:
                            </Text>
                            <StarRating
                                cook={props.name}
                                id={props.id}
								cookID={props.cookID}
                                refreshParent={props.refreshParent}
                                mode={props.mode}
                                userID={props.userID}
                            />
                        </>
                    )}
                </>
            ) : (
                <></>
            )}
        </View>
    );
};

export default AppointmentCard;

const styles = StyleSheet.create({
    card: {
        marginVertical: 10,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingTop: 10,
        backgroundColor: "#f5deb3",
        width: "100%",
        alignSelf: "center",
        alignItems: "center",
    },
    text: {
        marginTop: 15,
        // fontFamily: "Verdana",
    },
    labelName: {
        fontWeight: "bold",
        fontStyle: "italic",
        fontSize: 15,
    },
    labelEmphasise: {
        fontWeight: "bold",
        fontStyle: "italic",
        fontFamily: Platform.OS === "ios" ? "Verdana-BoldItalic" : "Roboto",
        fontSize: 15,
    },
    btnGroup: {
        flexDirection: "row",
        marginTop: 5,
        gap: 20,
        width: "100%",
    },
    btnAccept: {
        flex: 1,
    },
    btnDecline: {
        flex: 1,
        backgroundColor: "red",
        borderColor: "red",
    },
    labelStatus: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: Platform.OS === "ios" ? "AvenirNext-Bold" : "Roboto",
    },
});
