import { useEffect, useRef, useState } from "react";
import { projectId } from "../configs/pushNotificationsConfig";
import { isDevice } from "expo-device";
import {
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  getExpoPushTokenAsync,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
  AndroidImportance,
} from "expo-notifications";
import { STR_PERMISSION_GRANTED, STR_FIELD_PUSH_TOKEN } from "../constants/constants";
import { updateAcctInfo } from "../context/accountInfoContext";
import { getAuth } from "@firebase/auth";

const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    try {

      registerForPushNotifications().then((token) => setExpoPushToken(token));

      notificationListener.current = addNotificationReceivedListener(
        (notification) => {
          setNotification(notification);
        }
      );

      responseListener.current = addNotificationResponseReceivedListener(
        (response) => {
          console.log(response);
        }
      );

      return () => {
        removeNotificationSubscription(notificationListener.current);
        removeNotificationSubscription(responseListener.current);
      };
    } catch (err) {
      console.error(`Unable to use notifications. Error: ${err.message}`);
    }
  }, []);
};

export const registerForPushNotifications = async () => {
  let token;

  try {
    if (Platform.OS === "android") {
      setNotificationChannelAsync("default", {
        name: "default",
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // if (isDevice) {
    const { status: currentPermission } = await getPermissionsAsync();

    let finalPermission = currentPermission;

    if (currentPermission !== STR_PERMISSION_GRANTED) {
      const { status } = await requestPermissionsAsync();
      finalPermission = status;
    }

    if (finalPermission !== STR_PERMISSION_GRANTED) {
      throw Error("Failed to get push token for push notification!");
    }

    const tokenObj = await getExpoPushTokenAsync({ projectId: projectId });
    token = tokenObj.data;
    console.log(`Token is ${token}`);
    await updateAcctInfo( { [STR_FIELD_PUSH_TOKEN]: token } )
    // } else {
    //   throw Error("Must use physical device for Push Notifications");
    // }
  } catch (err) {
    console.error(
      `Unable to register for push notifications. Error: ${err.message}`
    );
    throw err;
  }

  return token;
};

export default useNotifications;
