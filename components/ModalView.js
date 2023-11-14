import {
    StyleSheet,
    Text,
    View,
    Platform,
    StatusBar,
    Dimensions,
    TouchableOpacity,
    Image,
    TextInput,
    Modal,
    ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
    addReservation,
    getAcctInfo,
} from "../context/accountInfoContext";
import { getFullLanguage } from "../helpers/searchHelper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { STR_FIELD_NAME, STR_FIELD_PUSH_TOKEN } from "../constants/constants";
import { sendPushNotificationByToken } from "../helpers/pushNotificationsHelper";
import { OpenURLButton } from "./OpenURLButton";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const SPACE_SCROLLVIEW = width * 0.1 - 10;

export const ModalView = ({ ...props }) => {
    
    return (
        <>
            <Modal
                visible={props.isModal}
                onRequestClose={() => {
                    props.setIsModal(false);
                }}
                animationType="slide"
                transparent={true}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View style={styles.bigCard}>
                        <ScrollView
                            style={{ width: "90%" }}
                            automaticallyAdjustKeyboardInsets={true}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                style={styles.modalImage}
                                source={require("../assets/cuisine.jpg")}
                                resizeMode="contain"
                            ></Image>
                            <Text
                                style={[
                                    styles.textSign,
                                    { fontSize: 16, width: "90%" },
                                ]}
                            >
                                {props.modalForm.name}
                            </Text>
                            <Text
                                style={[
                                    styles.textSign,
                                    { fontSize: 16, width: "90%" },
                                ]}
                            >
                                Lv: {props.modalForm.level}
                            </Text>
                            <Text
                                style={[
                                    styles.textSign,
                                    { fontSize: 16, width: "90%" },
                                ]}
                            >
                                phone: {props.modalForm.phone}
                            </Text>
                            <OpenURLButton
                                url={props.modalForm.portfolio}
                                txt={"Portfolio: "}
                            />
                            <Text
                                style={[
                                    styles.textSign,
                                    { fontSize: 16, width: "90%" },
                                ]}
                            >
                                dishes:{" "}
                                {props.isDishes(props.modalForm.dishes)
                                    ? props.modalForm.dishes.map((dish) => {
                                          return `${dish} / `;
                                      })
                                    : ""}
                            </Text>
                            <Text
                                style={[
                                    styles.textSign,
                                    { fontSize: 16, width: "90%" },
                                ]}
                            >
                                languages:{" "}
                                {props.isDishes(props.modalForm.languages)
                                    ? props.modalForm.languages.map((lang) => {
                                          return `${getFullLanguage(lang)} / `;
                                      })
                                    : ""}
                            </Text>
                            <Text
                                style={[
                                    styles.textSign,
                                    { fontSize: 16, width: "90%" },
                                ]}
                            >
                                Select Date:
                            </Text>
                            <DateTimePicker
                                value={props.date}
                                mode={"date"}
                                is24Hour={true}
                                onChange={(e, selectedDate) => {
                                    props.setDate(selectedDate);
                                }}
                            ></DateTimePicker>
                            <Text
                                style={[
                                    styles.textSign,
                                    { fontSize: 16, width: "90%" },
                                ]}
                            >
                                Select Time:
                            </Text>
                            <DateTimePicker
                                value={props.date}
                                mode={"time"}
                                is24Hour={true}
                                onChange={(e, selectedDate) => {
                                    props.setDate(selectedDate);
                                }}
                            ></DateTimePicker>
                            <Text
                                style={[
                                    styles.textSign,
                                    { fontSize: 16, width: "90%" },
                                ]}
                            >
                                Teaching Mode:
                            </Text>
                            <View
                                style={{
                                    width: "90%",
                                    zIndex: 1,
                                }}
                            >
                                <DropDownPicker
                                    open={props.open}
                                    value={props.teachingMode}
                                    items={props.teachingModeL}
                                    setOpen={props.setOpen}
                                    setValue={props.setTMode}
                                    setItems={props.setTMList}
                                    listMode="SCROLLVIEW"
                                    textStyle={{
                                        fontSize: 16,
                                    }}
                                    labelStyle={{
                                        fontWeight: "bold",
                                    }}
                                    placeholder={"Choose a teaching Mode."}
                                    maxHeight={100}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.textSign,
                                    {
                                        fontSize: 16,
                                        width: "90%",
                                        marginTop: 10,
                                    },
                                ]}
                            >
                                Address:
                            </Text>
                            <TextInput
                                placeholder="Address"
                                placeholderTextColor="black"
                                multiline={true}
                                maxHeight={48}
                                textAlignVertical={"top"}
                                autoCapitalize="none"
                                style={[styles.textModal]}
                                onChangeText={props.setAddress}
                            />
                            <Text
                                style={[
                                    styles.textSign,
                                    {
                                        fontSize: 16,
                                        width: "90%",
                                        marginTop: 10,
                                    },
                                ]}
                            >
                                Message:
                            </Text>
                            <TextInput
                                placeholder="Leave a message to cook"
                                placeholderTextColor="black"
                                autoCapitalize="none"
                                multiline={true}
                                maxHeight={48}
                                style={styles.textModal}
                                onChangeText={props.setMessage}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    props.setIsModal(false);
                                }}
                                style={[
                                    styles.btnBook,
                                    {
                                        borderColor: "red",
                                        borderWidth: 1,
                                        marginTop: 10,
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
                                    Back
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={async () => {
                                    props.setIsModal(false);
                                    console.log(props.date, props.teachingMode);
                                    const data = {
                                        cookid: props.modalForm.id,
                                        mode: props.teachingMode,
                                        date: props.date,
                                        address: props.address,
                                        phone: props.modalForm.phone,
                                    };
                                    if (props.message != "") {
                                        data.message = props.message;
                                    }
                                    if (props.teachingMode == "Zoom"){
                                        data.zoom = props.modalForm.zoom;
                                    }
                                    addReservation(data);

                                    const cookInfo = await getAcctInfo(
                                       props.modalForm.id
                                    );
                                    const learnerInfo = await getAcctInfo();
                                    const token =
                                        cookInfo[STR_FIELD_PUSH_TOKEN];
                                    const messages = {
                                        body: `${learnerInfo[STR_FIELD_NAME]} sent you an appointment request`,
                                    };
                                    sendPushNotificationByToken(
                                        token,
                                        messages
                                    );
                                }}
                                style={[
                                    styles.btnBook,
                                    {
                                        borderColor: "red",
                                        borderWidth: 1,
                                        marginTop: 10,
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
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
    bigCard: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        backgroundColor: "#FFF",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderRadius: 5,
        marginHorizontal: 10,
        width: width * 0.8,
        height: "80%",
        // justifyContent: "center",
        alignItems: "center",
    },
    modalImage: {
        width: width * 0.8,
        height: 200,
        // alignItems: "center",
    },
    textSign: {
        fontSize: 14,
        fontWeight: "bold",
        borderColor: "black",
        // borderWidth: 1,
    },
    btnBook: {
        width: "90%",
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 3,
    },
    textModal: {
        justifyContent: "flex-start",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 2,
        width: "90%",
        // height: "10%",
        fontSize: 16,
    },
});
