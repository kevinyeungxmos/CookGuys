import {
    StyleSheet,
    Text,
    View,
    Platform,
    StatusBar,
    Pressable,
    ActivityIndicator,
    Animated,
    Dimensions,
    TouchableOpacity,
    Image,
    TextInput,
    Modal,
    ScrollView,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import {
    mapRangeInKm,
    degreesToRadians,
    kMToLatitudes,
    kMToLongitudes,
    longitudesToKm,
} from "../helpers/locationHelper";
import MapView, { Callout, Marker } from "react-native-maps";
import { getUserCoordinateinRange } from "../context/accountInfoContext";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const SPACE_SCROLLVIEW = width * 0.1 - 10;

export const CookMapView = ({ ...props }) => {
    const mapRef = useRef(null);
    const scrollView_x = useRef(null);
    var interpolations = props.mapmarker.map((marker, index) => {
        const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            (index + 1) * CARD_WIDTH,
        ];

        const scale = props.animatedM.interpolate({
            inputRange,
            outputRange: [1, 1.5, 1],
            extrapolate: "clamp",
        });
        return { scale };
    });

    const onMPress = (event) => {
        const markerIndex = event._targetInst.return.key;
        let xIndex = (CARD_WIDTH + 20) * markerIndex;
        xIndex = xIndex - SPACE_SCROLLVIEW;
        scrollView_x.current.scrollTo({ x: xIndex, y: 0, animated: true });
    };

    useEffect(() => {
        props.animatedM.addListener(({ value }) => {
            indexX = Math.floor(value / CARD_WIDTH + 0.3);

            if (
                props.mapmarker === undefined ||
                props.mapmarker[0] === undefined
            ) {
                console.log("locating");
            } else {
                mapRef.current.animateToRegion(
                    {
                        latitude: props.mapmarker[indexX].lat,
                        longitude: props.mapmarker[indexX].lon,
                        latitudeDelta: props.newDelta.latitudeDelta,
                        longitudeDelta: props.newDelta.longitudeDelta,
                    },
                    200
                );
            }
        });
        return () => {
            props.animatedM.removeAllListeners();
        };
    }, [interpolations]);

    return (
        <>
            <MapView
                ref={mapRef}
                followsUserLocation={false}
                region={props.region}
                style={styles.map}
                onRegionChangeComplete={props.onRegionChangeComplete}
            >
                {props.mapmarker.map((marker, index) => {
                    return (
                        <Marker
                            key={index}
                            title={marker.name}
                            description={`Lv: ${marker.level}`}
                            coordinate={{
                                latitude: parseFloat(marker.lat),
                                longitude: parseFloat(marker.lon),
                            }}
                            onPress={onMPress}
                        >
                            <Animated.View style={[styles.markerWrap]}>
                                <Animated.Image
                                    source={require("../assets/location-marker-icon-15.jpg")}
                                    style={[
                                        styles.marker,
                                        {
                                            transform: [
                                                {
                                                    scale: interpolations[index]
                                                        .scale,
                                                },
                                            ],
                                        },
                                    ]}
                                    resizeMode="cover"
                                />
                            </Animated.View>
                        </Marker>
                    );
                })}
            </MapView>

            <Animated.ScrollView
                ref={scrollView_x}
                horizontal
                pagingEnabled
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + 20}
                snapToAlignment="center"
                style={styles.scrollView}
                decelerationRate={0.5}
                contentInset={{
                    top: 0,
                    left: SPACE_SCROLLVIEW,
                    bottom: 0,
                    right: SPACE_SCROLLVIEW,
                }}
                onScroll={Animated.event(
                    // animatedMap = e.nativeEvent.contentOffset.x
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    x: props.animatedM,
                                },
                            },
                        },
                    ],
                    { useNativeDriver: true }
                )}
                onScrollEndDrag={props.onScrollEndDrag}
            >
                {props.mapmarker.map((marker, index) => {
                    return (
                        <View style={styles.card} key={index}>
                            <Image
                                source={require("../assets/cuisine.jpg")}
                                style={styles.cardImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.cardText} numberOfLines={2}>
                                {marker.name} Lv: {marker.experience} {"\n"}
                                dishes:{" "}
                                {props.isDishes(marker.dishes)
                                    ? marker.dishes.map((dish) => {
                                          return `${dish} / `;
                                      })
                                    : ""}
                            </Text>

                            <View
                                style={{
                                    alignItems: "center",
                                    marginBottom: 5,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={()=>{
                                        props.setIsModal(true)
                                        props.setModalForm(marker)
                                    }}
                                    style={[
                                        styles.btnBook,
                                        {
                                            borderColor: "red",
                                            borderWidth: 1,
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
                                        Book Now
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </Animated.ScrollView>
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
    map: {
        width: "100%",
        height: "100%",
    },
    scrollView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    card: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        backgroundColor: "#FFF",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginHorizontal: 10,
        width: width * 0.8,
        height: 220,
    },
    cardImage: {
        width: "90%",
        height: "80%",
        alignSelf: "center",
        flex: 3,
    },
    cardText: {
        fontSize: 12,
        fontWeight: "bold",
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
    },
    marker: {
        width: 30,
        height: 30,
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
});
