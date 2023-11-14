import { auth } from "../configs/dbConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import getAuthErrorMsg from "../helpers/errorHelper";
import { STR_ERRMSG_UNKNOWN_ERROR } from "../constants/constants";
import { deleteAcct } from "./accountInfoContext";

const signUp = async (email, password) => {
  try {
    const userObj = await createUserWithEmailAndPassword(auth, email, password);
    console.log(`User created with email (${email}). Uid: ${userObj.user.uid}`);
    return userObj.user.uid;
  } catch (err) {
    console.error(`Failed to create user with email (${email}): ${err}`);
    err.desc = getAuthErrorMsg(err.code);
    throw err;
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log(`User ${auth.currentUser.uid} logged in`);
  } catch (err) {
    console.error(`Failed to sign in user: ${err}`);
    err.desc = getAuthErrorMsg(err.code);
    throw err;
  }
};

const logout = async () => {
  const userUid = auth.currentUser?.uid;
  try {
    await auth.signOut();
    console.log(`User (uid: ${userUid}) logged out`);
  } catch (err) {
    console.error(`Failed to sign out user (uid: ${userUid}: ${err}`);
    err.desc = STR_ERRMSG_UNKNOWN_ERROR;
    throw err;
  }
};

const reauthenticate = async (password) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);
    const result = await reauthenticateWithCredential(user, credential);
    return result;
  } catch (err) {
    console.log(`Unable to reauthenticate user. Error: ${err}`);
    throw err;
  }
};

const changePassword = async (currentPwd, newPwd) => {
  try {
    const { user } = await reauthenticate(currentPwd);
    await updatePassword(user, newPwd);
    console.log(`Password updated for user (uid: ${userUid})`);
  } catch (err) {
    console.error(`Unable to change password. Error: ${err}`);
    err.desc = getAuthErrorMsg(err.code);
    throw err;
  }
};

const deleteAccount = async (password) => {
  try {
    const { user } = await reauthenticate(password);
    await deleteAcct();
    await deleteUser(user);

    console.log(`Account deleted for user (uid: ${user.uid})`);
  } catch (err) {
    console.error(`Unable to delete user. Error: ${err}`);
    err.desc = getAuthErrorMsg(err.code);
    throw err;
  }
};

export { signUp, login, logout, changePassword, deleteAccount };
