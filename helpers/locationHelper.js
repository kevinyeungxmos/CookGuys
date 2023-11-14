import * as Location from "expo-location";
import { STR_FIELD_LAT, STR_FIELD_LON } from "../constants/constants";

const getPermission = () => {
    return Location.requestForegroundPermissionsAsync();
};

export const forwardGeocode = async (address) => {
    try {
        const permission = await getPermission();
        if (permission.status !== "granted") {
            throw new Error("Permission denied", `Cannot use Location Service`);
        }

        const results = await Location.geocodeAsync(address);

        if (results === undefined) {
            throw new Error("Invalid address", `Invalid address ${address}`);
        }

        const { latitude, longitude } = results[0];

        return {
            [STR_FIELD_LAT]: latitude,
            [STR_FIELD_LON]: longitude,
        };
    } catch (error) {
        console.error(error?.message);
    }
};

const mapRangeInKm = {
    small: 5.0,
    medium: 10.0,
    large: 15.0,
};

const degreesToRadians = (angle) => {
    return angle * (Math.PI / 180);
};

const kMToLongitudes = (km, atLatitude) => {
    return (km * 0.0089831) / Math.cos(degreesToRadians(atLatitude));
};

const longitudesToKm = (lonDelta, atLat) => {
    return (lonDelta * Math.cos(degreesToRadians(atLat))) / 0.0089831;
};

const kMToLatitudes = (km) => {
    return km / 110.574;
};

export { kMToLatitudes, longitudesToKm, kMToLongitudes, mapRangeInKm };
