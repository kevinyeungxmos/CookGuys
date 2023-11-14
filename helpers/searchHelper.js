import { LANGUAGES } from "../constants/languages";

const getAbbrLanguage = (country) => {
    const abbr = LANGUAGES.filter((lang, index) => {
        if (lang.label == country) {
            return lang.value;
        }
    });

    if (abbr.length != 0) {
        return abbr[0].value;
    } else {
        return "";
    }
};

const getFullLanguage = (abbr) => {
    const langs = LANGUAGES.filter((lang, index) => {
        if (lang.value == abbr) {
            return lang;
        }
    });

    if (langs.length != 0) {
        return langs[0].label;
    } else {
        return "";
    }
};

const isDataValid = (doc) => {
    if (doc.lat === undefined || doc.lat === "" || doc.lon === undefined || doc.lon === ""){
        return false;
    }
    return true;
}

export { getAbbrLanguage, getFullLanguage, isDataValid };
