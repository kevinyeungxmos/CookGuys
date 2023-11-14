import { useEffect, useState } from "react";
import { Alert, View, FlatList, } from "react-native";

import Background from "../components/Background";
import {
    STR_ACCT_INFO_UPDATED,
    STR_ERROR,
    STR_FIELD_LEVEL,
    STR_FIELD_EXPERIENCE,
    STR_FIELD_NAME,
    STR_SUCCESS,
} from "../constants/constants";
import { getAcctInfo, updateAcctInfo } from "../context/accountInfoContext";
import {
    DEFAULT_PROFILE_FORM,
    getInitialProfileForm,
    toProfileDTO,
} from "../helpers/profileHelper";
import LoadingView from "../components/LoadingView";
import ProfileHeader from "../components/ProfileHeader";
import { useIsFocused } from "@react-navigation/native";
import AppointmentCard from "../components/AppointmentCard";

const SearchScreenCover = ({bookings, checkBooking}) => {
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
    }, [isFocused]);


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
                    <FlatList
                        keyExtractor={(item) => item.id}
                        data={bookings}
                        renderItem={({ item }) => {
                            return (
                                <>
                                    <AppointmentCard
                                        id={item.id}
                                        {...item}
                                        refreshParent={checkBooking}
                                        isTeaching={false}
                                    />
                                </>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        style={{ width: "100%" }}
                    />
                </>
            )}
        </Background>
    );
};

export default SearchScreenCover;
