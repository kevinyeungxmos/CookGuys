import { Alert } from "react-native";
import {
  STR_FIELD_ADDRESS,
  STR_FIELD_LEVEL,
  STR_FIELD_DISHES,
  STR_FIELD_EXPERIENCE,
  STR_FIELD_LANGUAGES,
  STR_FIELD_LAT,
  STR_FIELD_LON,
  STR_FIELD_NAME,
  STR_FIELD_PHONE,
  STR_FIELD_PORTFOLIO,
  STR_FIELD_ZOOM,
  STR_FIELD_COOK_EXPERIENCE,
  STR_ERROR,
} from "../constants/constants";
import { forwardGeocode } from "./locationHelper";

export const DEFAULT_PROFILE_FORM = {
  [STR_FIELD_NAME]: "",
  [STR_FIELD_ADDRESS]: "",
  [STR_FIELD_LEVEL]: 0,
  [STR_FIELD_EXPERIENCE]: 0,
  [STR_FIELD_COOK_EXPERIENCE]: 0,
  [STR_FIELD_PORTFOLIO]: "",
  [STR_FIELD_ZOOM]: "",
  [STR_FIELD_PHONE]: "",
  [STR_FIELD_DISHES]: [],
  [STR_FIELD_LANGUAGES]: [],
};

export const getInitialProfileForm = (form, user) => {
  return Object.keys(form)
    .map((key) => [key, user[key] ?? form[key]])
    .reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value,
      }),
      {}
    );
};

export const toProfileDTO = async (form) => {
  const dto = { ...form };
  const address = form[STR_FIELD_ADDRESS];
  try {
    const { lat, lon } = await forwardGeocode(address);
    dto[STR_FIELD_LAT] = lat;
    dto[STR_FIELD_LON] = lon;
  } catch (err) {
    console.error(err);
    err.desc = "Address cannot be identified";
    throw err;
  }

  dto[STR_FIELD_COOK_EXPERIENCE] = Number(form[STR_FIELD_COOK_EXPERIENCE]);
  dto[STR_FIELD_DISHES] = dto[STR_FIELD_DISHES];

  return dto;
};
