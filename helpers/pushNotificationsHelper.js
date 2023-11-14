import { scheduleNotificationAsync } from "expo-notifications";
import { STR_NOTIF_APP_TITLE, STR_NOTIF_NEW_MSG } from "../constants/constants";

const sendPushNotification = async (notification) => {
  const message = {
    sound: notification.sound || "default",
    title: notification.title || STR_NOTIF_APP_TITLE,
    body: notification.body || STR_NOTIF_NEW_MSG,
  };

  await scheduleNotificationAsync({
    content: message,
    trigger: notification.delay || null,
  });
};

const sendPushNotificationByToken = async (token, notification) => {
  try {
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      body: JSON.stringify({
        to: token,
        title: notification.title || STR_NOTIF_APP_TITLE,
        body: notification.body || STR_NOTIF_NEW_MSG,
        sound: "default",
        icon: "/assets/images/splash.png",
        android: {
          icon: "/assets/images/splash.png",
          sound: "default",
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    console.log(`Notifcation sent to device with token (${token})`);
  } catch (err) {
    console.error(
      `Unable to send push notification to device with token (${token}). Error: ${err}`
    );
  }
};

export { sendPushNotification, sendPushNotificationByToken };
