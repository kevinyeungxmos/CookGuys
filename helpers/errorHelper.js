import {
  STR_ERRMSG_AUTH_WEAK_PASSWORD,
  STR_ERRMSG_EMAIL_IN_USE,
  STR_ERRMSG_INVALID_EMAIL,
  STR_ERRMSG_INVALID_LOGIN_CREDENTIALS,
  STR_ERRMSG_INVALID_PASSWORD,
  STR_ERRMSG_MISSING_PASSWORD,
  STR_ERRMSG_TOO_MANY_REQUESTS,
  STR_ERRMSG_UNKNOWN_ERROR,
} from "../constants/constants";

const authErrorMsgMap = {
  "auth/weak-password": STR_ERRMSG_AUTH_WEAK_PASSWORD,
  "auth/email-already-exists": STR_ERRMSG_EMAIL_IN_USE,
  "auth/email-already-in-use": STR_ERRMSG_EMAIL_IN_USE,
  "auth/invalid-email": STR_ERRMSG_INVALID_EMAIL,
  "auth/invalid-password": STR_ERRMSG_INVALID_PASSWORD,
  "auth/too-many-requests": STR_ERRMSG_TOO_MANY_REQUESTS,
  "auth/invalid-login-credentials": STR_ERRMSG_INVALID_LOGIN_CREDENTIALS,
  "auth/missing-password": STR_ERRMSG_MISSING_PASSWORD,
};

const getAuthErrorMsg = (errCode) => {
  return authErrorMsgMap[errCode] ?? STR_ERRMSG_UNKNOWN_ERROR;
};

export default getAuthErrorMsg;
