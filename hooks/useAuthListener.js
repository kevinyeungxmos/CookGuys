import { useEffect, useState } from "react";
import { auth } from "../configs/dbConfig";
import { registerForPushNotifications } from "./usePushNotifications";

export const useAuthListener = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(user !== null ? true : false);
      console.log(
        `Auth state changed. ${
          user !== null ? `User uid: ${user.uid}` : "User not logged in"
        }`
      );
      registerForPushNotifications().then((token) => {console.log("Token Set!")});
    });


    return listener;
  }, []);

  return isLoggedIn;
};
