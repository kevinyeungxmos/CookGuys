import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
    orderBy,
} from "firebase/firestore";
import { auth, db } from "../configs/dbConfig";
import {
    STR_ACCEPTED,
    STR_COLLECTION_RESERVATION,
    STR_COLLECTION_USERS,
    STR_DECLINED,
    STR_FIELD_COOKID,
    STR_FIELD_NAME,
    STR_FIELD_USERID,
} from "../constants/constants";

const changeBookingStatus = async (reservationId, isAccepted) => {
    try {
        const userId = auth.currentUser.uid;
        if (!userId) throw Error("User is not logged in");

        const reservation = doc(db, STR_COLLECTION_RESERVATION, reservationId);
        await updateDoc(reservation, {
            status: isAccepted ? STR_ACCEPTED : STR_DECLINED,
        });

        console.log(
            `Booking ${reservationId}: status changed to ${
                isAccepted ? STR_ACCEPTED : STR_DECLINED
            }`
        );
    } catch (err) {
        console.error(
            `Failed to change booking status to database. Error: ${err}`
        );
        throw err;
    }
};

const getAcceptedBooking = (bookings) => {
    let actb = [];
    for (const booking of bookings) {
        if (booking.status == "Accepted") {
            actb.push(booking);
        }
    }
    return actb;
};

const getUserBookings = async (isTeaching) => {
    try {
        const userBookings = [];
        let q;

        q = isTeaching
            ? query(
                  collection(db, STR_COLLECTION_RESERVATION),
                  where(STR_FIELD_COOKID, "==", auth.currentUser.uid),
                  orderBy("DateTime", "desc")
              )
            : query(
                  collection(db, STR_COLLECTION_RESERVATION),
                  where(STR_FIELD_USERID, "==", auth.currentUser.uid),
                  orderBy("DateTime", "desc")
              );

        const snapshots = await getDocs(q);

        for (const doc of snapshots.docs) {
            const userId = isTeaching
                ? doc.data()[STR_FIELD_USERID]
                : doc.data()[STR_FIELD_COOKID];

            const name = await getUserNameById(userId);

            const booking = {
                id: doc.id,
                ...doc.data(),
                name: name,
            };

            userBookings.push(booking);
        }

        return userBookings;
    } catch (err) {
        console.error(
            `Failed to retrieve all user bookings for ${
                isTeaching ? "teaching" : "learning"
            }. Error: ${err}`
        );
        throw err;
    }
};

const getUserNameById = async (userId) => {
    try {
        const docRef = doc(db, STR_COLLECTION_USERS, userId);

        const docSnap = await getDoc(docRef);

        return docSnap.data()[STR_FIELD_NAME];
    } catch (err) {
        console.error(`Failed to retrieve user name. Error: ${err}`);
        throw err;
    }
};

export { changeBookingStatus, getUserBookings, getAcceptedBooking };
