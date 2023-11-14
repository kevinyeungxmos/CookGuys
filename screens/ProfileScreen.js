import { useEffect, useState } from "react";
import { Alert, View, Clipboard, ScrollView } from "react-native";

import Background from "../components/Background";
import Button from "../components/Button";
import MenuItemPicker from "../components/DropdownPicker";
import TagInput from "../components/TagInput";
import TextInput from "../components/TextInput";
import {
    STR_ACCT_INFO_UPDATED,
    STR_ERROR,
    STR_FIELD_ADDRESS,
    STR_FIELD_LEVEL,
    STR_FIELD_DISHES,
    STR_FIELD_EXPERIENCE,
    STR_FIELD_LANGUAGES,
    STR_FIELD_NAME,
    STR_FIELD_PHONE,
    STR_FIELD_PORTFOLIO,
    STR_FIELD_ZOOM,
    STR_SUCCESS,
    STR_FIELD_COOK_EXPERIENCE,
} from "../constants/constants";
import { LANGUAGES } from "../constants/languages";
import { getAcctInfo, updateAcctInfo } from "../context/accountInfoContext";
import {
    DEFAULT_PROFILE_FORM,
    getInitialProfileForm,
    toProfileDTO,
} from "../helpers/profileHelper";
import LoadingView from "../components/LoadingView";

import {
    Entypo,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";
import { capitalize } from "../helpers/formatHelper";
import ProfileHeader from "../components/ProfileHeader";
import { useIsFocused } from "@react-navigation/native";

const ProfileScreen = () => {
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState(DEFAULT_PROFILE_FORM);

	const startFetching = async () => {
		try {
			const user = await getAcctInfo();
			setForm(getInitialProfileForm(DEFAULT_PROFILE_FORM, user));
			setIsLoading(false);
		} catch (err) {
			console.log(err);
		}
	};

    useEffect(() => {
        startFetching();
		setIsLoading(true);
    },[isFocused]);

    const onFormChanged = (field, value) => {
        const newForm = {
            ...form,
            [field]: value,
        };

        setForm(newForm);
    };

    // console.log(typeof form, form);

    const save = async () => {
        try {
            const dto = await toProfileDTO(form);
            await updateAcctInfo(dto);
            Alert.alert(STR_SUCCESS, STR_ACCT_INFO_UPDATED);
        } catch (err) {
            Alert.alert(STR_ERROR, err.desc);
        }
    };

    return (
        <ScrollView style={{ backgroundColor: "#FFF" }}>
            <Background inputMode alignTop>
                {isLoading ? (
                    <LoadingView />
                ) : (
                    <>
                        <ProfileHeader
                            name={form[STR_FIELD_NAME]}
                            level={form[STR_FIELD_LEVEL]}
                            exp={form[STR_FIELD_EXPERIENCE]}
                        />

                        <TextInput
                            icon={
                                <Entypo
                                    name="location"
                                    size={24}
                                    color="black"
                                />
                            }
                            value={form[STR_FIELD_ADDRESS]}
                            onChangeText={(value) =>
                                onFormChanged(STR_FIELD_ADDRESS, value)
                            }
                            placeholder={capitalize(STR_FIELD_ADDRESS)}
                            // editable={false}
                        />
                        <TextInput
                            icon={
                                <MaterialCommunityIcons
                                    name="chef-hat"
                                    size={24}
                                    color="black"
                                />
                            }
                            value={form[STR_FIELD_COOK_EXPERIENCE]?.toString()}
                            onChangeText={(value) =>
                                onFormChanged(STR_FIELD_COOK_EXPERIENCE, value)
                            }
                            placeholder={STR_FIELD_COOK_EXPERIENCE}
                            keyboardType="decimal-pad"
                            contextMenuHidden={true}
                            onFocus={() => {
                                Clipboard.setString("");
                            }}
                        />
                        <TextInput
                            icon={
                                <Entypo name="link" size={24} color="black" />
                            }
                            value={form[STR_FIELD_PORTFOLIO]}
                            onChangeText={(value) =>
                                onFormChanged(STR_FIELD_PORTFOLIO, value)
                            }
                            placeholder={capitalize(STR_FIELD_PORTFOLIO)}
                        />
                        <TextInput
                            icon={
                                <MaterialIcons
                                    name="phone-in-talk"
                                    size={24}
                                    color="black"
                                />
                            }
                            value={form[STR_FIELD_PHONE]}
                            onChangeText={(value) =>
                                onFormChanged(STR_FIELD_PHONE, value)
                            }
                            placeholder={capitalize(STR_FIELD_PHONE)}
                            keyboardType="phone-pad"
                            contextMenuHidden={true}
                            onFocus={() => {
                                Clipboard.setString("");
                            }}
                        />
                        <TextInput
                            icon={
                                <Ionicons
                                    name="md-videocam"
                                    size={24}
                                    color="black"
                                />
                            }
                            value={form[STR_FIELD_ZOOM]}
                            onChangeText={(value) =>
                                onFormChanged(STR_FIELD_ZOOM, value)
                            }
                            placeholder={capitalize(STR_FIELD_ZOOM)}
                        />

                        {isLoading ? (
                            <TagInput
                                icon={
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <MaterialCommunityIcons
                                            name="food-turkey"
                                            size={24}
                                            color="black"
                                            style={{ marginRight: 8 }}
                                        />
                                    </View>
                                }
                                initialTags={form[STR_FIELD_DISHES]}
                                onChangeTags={(value) =>
                                    onFormChanged(STR_FIELD_DISHES, value)
                                }
                            />
                        ) : (
                            <TagInput
                                icon={
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <MaterialCommunityIcons
                                            name="food-turkey"
                                            size={24}
                                            color="black"
                                            style={{ marginRight: 8 }}
                                        />
                                    </View>
                                }
                                initialTags={form[STR_FIELD_DISHES]}
                                onChangeTags={(value) =>
                                    onFormChanged(STR_FIELD_DISHES, value)
                                }
                            />
                        )}

                        <MenuItemPicker
                            value={form[STR_FIELD_LANGUAGES]}
                            onChange={(value) =>
                                onFormChanged(STR_FIELD_LANGUAGES, value)
                            }
                            data={LANGUAGES}
                            renderLeftIcon={() => (
                                <MaterialIcons
                                    name="language"
                                    size={24}
                                    color="black"
                                    style={{ marginRight: 8 }}
                                />
                            )}
                            placeholder="Select Languages"
                            dropdownPosition="top"
                        />

                        <Button onPress={save} label="Save" />
                    </>
                )}
            </Background>
        </ScrollView>
    );
};

export default ProfileScreen;
