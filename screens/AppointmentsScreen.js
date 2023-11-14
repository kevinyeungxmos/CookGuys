import { Alert, FlatList, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import AppointmentCard from "../components/AppointmentCard";
import Background from "../components/Background";
import { getUserBookings } from "../context/bookingContext";
import LoadingView from "../components/LoadingView";
import { useIsFocused } from "@react-navigation/native";
import Button from "../components/Button";
import {
  STR_FILTER_LEARNING,
  STR_FILTER_TEACHING,
} from "../constants/constants";

const AppointmentsScreen = () => {
  const [isTeaching, setIsTeaching] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    retrieveBookings();
  }, [isTeaching, isFocused]);

  const retrieveBookings = async () => {
    setIsLoading(true);

    try {
      const bookings = await getUserBookings(isTeaching);
      setBookings(bookings);
      console.log(bookings);
    } catch (err) {
      Alert.alert("Failed to retrieve bookings");
    }
    setIsLoading(false);
  };

  const getFilterBtnStyleByLabel = (btnLabel) => {
    const styles = {
      flex: 1,
    };

    if (btnLabel === STR_FILTER_TEACHING) {
      styles.backgroundColor = isTeaching ? "black" : "gray";
      styles.borderColor = isTeaching ? "black" : "gray";
    } else {
      styles.backgroundColor = !isTeaching ? "black" : "gray";
      styles.borderColor = !isTeaching ? "black" : "gray";
    }

    return styles;
  };

  return (
    <Background>
      {isLoading ? (
        <LoadingView />
      ) : (
        <>
          <View style={{ flexDirection: "row", gap: 20, width: "100%" }}>
            <Button
              label={STR_FILTER_TEACHING}
              onPress={() => setIsTeaching(true)}
              customStyles={getFilterBtnStyleByLabel(STR_FILTER_TEACHING)}
              paddingVerticalSize={10}
            />

            <Button
              label={STR_FILTER_LEARNING}
              onPress={() => setIsTeaching(false)}
              customStyles={getFilterBtnStyleByLabel(STR_FILTER_LEARNING)}
              paddingVerticalSize={10}
            />
          </View>
          <FlatList
            keyExtractor={(item) => item.id}
            data={bookings}
            renderItem={({ item }) => {
              return (
                <>
                  <AppointmentCard
                    id={item.id}
                    {...item}
                    refreshParent={retrieveBookings}
                    isTeaching={isTeaching}
                  />
                </>
              );
            }}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%" }}
          />
        </>
      )}
    </Background>
  );
};

export default AppointmentsScreen;
