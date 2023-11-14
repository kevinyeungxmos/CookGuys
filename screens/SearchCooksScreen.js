import {
    StyleSheet,
    View,
    Platform,
    StatusBar,
    ActivityIndicator,
    Animated,
    Dimensions,
    TextInput,
} from "react-native";
import { DEFAULT_PROFILE_FORM } from "../helpers/profileHelper";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
    getUserCoordinateinRange,
    getSearchResult,
} from "../context/accountInfoContext";
import {
    kMToLatitudes,
    kMToLongitudes,
    longitudesToKm,
    mapRangeInKm,
} from "../helpers/locationHelper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { CookMapView } from "../components/CookMapView";
import { RangeBar } from "../components/RangeBar";
import { ModalView } from "../components/ModalView";
import { useIsFocused } from "@react-navigation/native";
import SearchScreenCover from "./SearchScreenCover";
import { getUserBookings, getAcceptedBooking } from "../context/bookingContext";

const { width, height } = Dimensions.get("window");
export const CARD_WIDTH = width * 0.8;
var dmap = [];

const SearchCooksScreen = () => {
    const isFocused = useIsFocused();
    const [mapRange, setMapRange] = useState(mapRangeInKm.small);
    const [loading, setLoading] = useState(false);
    const [keywords, setKeywords] = useState("");
    const [coordinate, setCoordinate] = useState({
        latitude: "",
        longitude: "",
    });
    const [newDelta, setNewDelta] = useState({
        latitudeDelta: "",
        longitudeDelta: "",
    });
    const [region, setRegion] = useState({
        latitude: "",
        longitude: "",
        latitudeDelta: "",
        longitudeDelta: "",
    });
    const [modalForm, setModalForm] = useState(DEFAULT_PROFILE_FORM);
    const [isBooked, setIsBooked] = useState(false);
    let [mapMarker, setmapMarker] = useState([]);
    let [acceptedBooking, setAcceptedBooking] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const animatedMap = useRef(new Animated.Value(0)).current;
    const scrollView_x = useRef(null);
    const [date, setDate] = useState(new Date());
    const [teachingMode, setTMode] = useState("In person");
    const [teachingModeL, setTMList] = useState([
        { label: "In person", value: "In person" },
        { label: "Online", value: "Zoom" },
    ]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [address, setAddress] = useState("");

    var cardGesture = false;
    var indexX = 0;

    const getGeoRange = (lat, lon, km) => {
        const latRange = kMToLatitudes(km);
        const lonRange = kMToLongitudes(km, lat);
        const geoRange = {
            northLat: lat - latRange,
            southLat: lat + latRange,
            westLon: lon - lonRange,
            eastLon: lon + lonRange,
        };
        return geoRange;
    };

    const getMarkerDetails = (lat, lon, mapRange) => {
        setmapMarker([]);
        dmap = [];

        const geoRange = getGeoRange(lat, lon, mapRange);

        getUserCoordinateinRange(geoRange).then((result) => {
            setmapMarker(result);
            dmap.push(result);
        });
    };

    const isInViewport = (newRegion) => {
        const n = region.latitude + region.latitudeDelta / 2 + 0.03;
        const s = region.latitude - region.latitudeDelta / 2 - 0.03;
        const e = region.longitude + region.longitudeDelta / 2 + 0.03;
        const w = region.longitude - region.longitudeDelta / 2 - 0.03;

        return (
            newRegion.latitude <= n &&
            newRegion.latitude >= s &&
            newRegion.longitude <= e &&
            newRegion.longitude >= w
        );
    };

    const getCurrentLocation = async () => {
        try {
            setLoading(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(`Permission to access location was denied`);
                setLoading(false);
                return;
            }
            let location = await Location.getCurrentPositionAsync();
            setLoading(false);
            setCoordinate({
                lat: location.coords.latitude,
                lon: location.coords.longitude,
            });
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta:
                    kMToLongitudes(mapRange + 15, location.coords.latitude) -
                    0.000001,
                longitudeDelta: kMToLongitudes(
                    mapRange + 15,
                    location.coords.latitude
                ),
            });

            getMarkerDetails(
                location.coords.latitude,
                location.coords.longitude,
                mapRange
            );
        } catch (err) {
            console.log(err);
        }
    };

    const onRegionChangeCompleted = (newRegion) => {
        setNewDelta({
            latitudeDelta: newRegion.latitudeDelta,
            longitudeDelta: newRegion.longitudeDelta,
        });
        if (cardGesture) {
            if (
                newRegion.latitude.toFixed(5) ==
                    parseFloat(dmap[0][indexX].lat).toFixed(5) &&
                newRegion.longitude.toFixed(5) ==
                    parseFloat(dmap[0][indexX].lon).toFixed(5)
            ) {
                cardGesture = false;
            }
        } else {
            if (!isInViewport(newRegion)) {
                getMarkerDetails(
                    newRegion.latitude,
                    newRegion.longitude,
                    longitudesToKm(newRegion.longitudeDelta, newRegion.latitude)
                );
                setRegion({
                    latitude: newRegion.latitude,
                    longitude: newRegion.longitude,
                    latitudeDelta: newRegion.latitudeDelta,
                    longitudeDelta: newRegion.longitudeDelta,
                });
            }
        }
    };

    const isDishes = (dish) => {
        if (dish === undefined) {
            return false;
        }
        if (dish === "") {
            return false;
        }
        return true;
    };

    const checkBooking = async () => {
        try {
            const booking = await getUserBookings(false);
            const accbooking = getAcceptedBooking(booking);
            if (accbooking.length != 0) {
                setIsBooked(true);
                setAcceptedBooking(accbooking);
            } else {
                setIsBooked(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    useEffect(() => {
        setRegion({
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta:
                kMToLongitudes(mapRange + 15, region.latitude) - 0.0001,
            longitudeDelta: kMToLongitudes(mapRange + 15, region.latitude),
        });

        getMarkerDetails(region.latitude, region.longitude, mapRange);
    }, [mapRange]);

    useEffect(() => {
        checkBooking();
    }, [isFocused]);

    return (
        <View style={styles.container}>
            {loading ? (
                <View
                    style={{
                        justify: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        position: "absolute",
                        zIndex: 1,
                    }}
                >
                    <ActivityIndicator size="small" color="blue" />
                </View>
            ) : (
                <></>
            )}
            {isBooked ? (
                <>
                    <SearchScreenCover
                        bookings={acceptedBooking}
                        checkBooking={checkBooking}
                    />
                </>
            ) : (
                <>
                    <CookMapView
                        followsUserLocation={false}
                        region={region}
                        onRegionChangeComplete={onRegionChangeCompleted}
                        mapmarker={mapMarker}
                        animatedM={animatedMap}
                        mapRange={mapRange}
                        scrollView_x={scrollView_x}
                        onScrollEndDrag={() => {
                            cardGesture = true;
                        }}
                        newDelta={newDelta}
                        isDishes={isDishes}
                        setIsModal={setIsModal}
                        setModalForm={setModalForm}
                    ></CookMapView>

                    <View style={styles.searchBox}>
                        <TextInput
                            placeholder="keywords"
                            placeholderTextColor="white"
                            autoCapitalize="none"
                            style={{ flex: 1, padding: 0 }}
                            onChangeText={setKeywords}
                        />
                        {/* <Ionicons name="mic" size={18} style={{ marginRight: 5 }} /> */}
                        <Ionicons
                            name="ios-search"
                            size={18}
                            onPress={() => {
                                getSearchResult(keywords).then((result) => {
                                    console.log("result: ", result);
                                    setmapMarker(result);
                                    dmap = [];
                                    dmap.push(result);
                                });
                            }}
                        />
                    </View>

                    <RangeBar
                        onPressSmall={() => {
                            setMapRange(mapRangeInKm.small);
                            console.log(`${mapRange} clicked`);
                        }}
                        onPressMedium={() => {
                            setMapRange(mapRangeInKm.medium);
                            console.log(`${mapRange} clicked`);
                        }}
                        onPressLarge={() => {
                            setMapRange(mapRangeInKm.large);
                            console.log(`${mapRange} clicked`);
                        }}
                    />

                    <ModalView
                        isModal={isModal}
                        setIsModal={setIsModal}
                        modalForm={modalForm}
                        isDishes={isDishes}
                        setDate={setDate}
                        teachingMode={teachingMode}
                        teachingModeL={teachingModeL}
                        setOpen={setOpen}
                        open={open}
                        setTMode={setTMode}
                        setTMList={setTMList}
                        setAddress={setAddress}
                        setMessage={setMessage}
                        message={message}
                        date={date}
                        address={address}
                    />
                </>
            )}
        </View>
    );
};

export default SearchCooksScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    searchBox: {
        position: "absolute",
        marginTop: 10,
        flexDirection: "row",
        backgroundColor: "white",
        width: "90%",
        alignSelf: "center",
        borderRadius: 5,
        padding: 10,
        shadowColor: "gray",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
});
