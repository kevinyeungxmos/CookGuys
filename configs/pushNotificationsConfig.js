import Constants from "expo-constants";
import { setNotificationHandler } from "expo-notifications";

const projectId =
  Constants.easConfig?.projectId ||
  Constants.expoConfig.extra?.eas?.projectId ||
  "31daedf2-435e-418f-95e0-4d341b669f77";

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export { projectId };
