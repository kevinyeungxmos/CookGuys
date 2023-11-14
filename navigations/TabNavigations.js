import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import AppointmentsScreen from "../screens/AppointmentsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RecipesScreen from "../screens/RecipesScreen";
import SearchCooksScreen from "../screens/SearchCooksScreen";
import { RatingScreen } from "../screens/RatingScreen";

import {
    SCREEN_SEARCH_COOKS,
    SCREEN_RECIPES,
    SCREEN_PROFILE,
    SCREEN_APPOINTMENTS,
    SCREEN_RATING,
} from "../constants/constants";
import { useGoogleAds } from "../hooks/useGoogleAds";
import SettingButton from "../components/SettingButton";
import { useEffect, useState } from "react";
import { getBookingIDAccepted } from "../context/accountInfoContext";

const Tab = createBottomTabNavigator();

const Setting = { headerRight: () => SettingButton() };

const TabNavigations = () => {
    // const [acceptedBooking, setAcceptedBooking] = useState([]);
    // const [isAccepted, setIsAccepted] = useState(false);
    useGoogleAds();

    // useEffect(() => {
    //     getBookingIDAccepted().then((acceptedBooking) => {
    //         setAcceptedBooking(acceptedBooking);
    //         if (acceptedBooking.length != 0) {
    //             setIsAccepted(true);
    //             console.log("set booking aCCEPTED TRUE");
    //             console.log("acceptedBooking: ", acceptedBooking);
    //         }
    //     });
    // }, []);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === SCREEN_SEARCH_COOKS) {
                        iconName = "search";
                    } else if (route.name === SCREEN_RECIPES) {
                        iconName = "restaurant-outline";
                    } else if (route.name === SCREEN_PROFILE) {
                        iconName = "person";
                    } else if (route.name === SCREEN_APPOINTMENTS) {
                        iconName = "calendar-sharp";
                    } else if (route.name === SCREEN_RATING) {
                        iconName = "rate-review";
                        return (
                            <MaterialIcons
                                name="rate-review"
                                size={size}
                                color={color}
                            />
                        );
                    }

                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                tabBarActiveTintColor: "#24A0ED",
                tabBarInactiveTintColor: "gray",
            })}
        >
            {/* {isAccepted ? (
				<Tab.Screen
                    name={SCREEN_RATING}
                    component={RatingScreen}
                    options={Setting}
                />
            ) : (
                <Tab.Screen
                    name={SCREEN_SEARCH_COOKS}
                    component={SearchCooksScreen}
                    options={Setting}
                />
            )} */}
            <Tab.Screen
                name={SCREEN_SEARCH_COOKS}
                component={SearchCooksScreen}
                options={Setting}
            />
            <Tab.Screen
                name={SCREEN_RECIPES}
                component={RecipesScreen}
                options={Setting}
            />
            <Tab.Screen
                name={SCREEN_PROFILE}
                component={ProfileScreen}
                options={Setting}
            />
            <Tab.Screen
                name={SCREEN_APPOINTMENTS}
                component={AppointmentsScreen}
                options={Setting}
            />
        </Tab.Navigator>
    );
};

export default TabNavigations;
