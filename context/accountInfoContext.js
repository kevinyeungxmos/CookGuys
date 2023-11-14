import { auth, db } from "../configs/dbConfig";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    getDocs,
    query,
    collection,
    where,
    and,
    Timestamp,
    addDoc,
    deleteDoc,
} from "firebase/firestore";
import {
    STR_FIELD_NAME,
    STR_COLLECTION_USERS,
    STR_FIELD_LANGUAGES,
    STR_FIELD_EXPERIENCE,
    STR_FIELD_LAT,
    STR_FIELD_LON,
    STR_FIELD_PORTFOLIO,
    STR_FIELD_DISHES,
    STR_COLLECTION_RESERVATION,
    STR_FIELD_DATETIME,
    STR_FIELD_COOKID,
    STR_FIELD_USERID,
    STR_FIELD_MODE,
    STR_FIELD_MESSAGE,
    STR_FIELD_ADDRESS,
    STR_FIELD_LEVEL,
    STR_ERRMSG_UPDATE_ACCT_INFO_FAILURE,
    STR_FIELD_PHONE,
    STR_FIELD_ZOOM,
} from "../constants/constants";
import { isDataValid } from "../helpers/searchHelper";
import { async } from "@firebase/util";

const addAcctInfo = async (userId, name) => {
    const acctInfo = {
        [STR_FIELD_NAME]: name,
        [STR_FIELD_EXPERIENCE]: 0,
        [STR_FIELD_LEVEL]: 0,
    };

    try {
        const acctInfoRef = doc(db, STR_COLLECTION_USERS, userId);
        await setDoc(acctInfoRef, acctInfo);
        console.log(`User info created for user id: ${userId}`);
    } catch (err) {
        console.error(`Failed to add account info to database. Error: ${err}`);
        err.desc = "Unable to save user info";
        throw err;
    }
};

const getAcctInfo = async (uid) => {
    const userId = uid || auth.currentUser.uid;

    const ref = doc(db, STR_COLLECTION_USERS, userId);
    const document = await getDoc(ref);
    return document.data();
};

const updateAcctInfo = async (form) => {
    try {
        const userId = auth.currentUser.uid;
        if (!userId) throw Error("User is not logged in");
        const acctInfoRef = doc(db, STR_COLLECTION_USERS, userId);
        console.log("Check uid");
        await updateDoc(acctInfoRef, form);
        console.log(`User info updated for user id: ${userId}`);
    } catch (err) {
        console.error(`Failed to save account info to database. Error: ${err}`);
        err.desc = STR_ERRMSG_UPDATE_ACCT_INFO_FAILURE;
        throw err;
    }
};

const deleteAcct = async () => {
    try {
        const userId = auth.currentUser.uid;
        const acctInfoRef = doc(db, STR_COLLECTION_USERS, userId);
        await deleteDoc(acctInfoRef);
        console.log(`User info deleted for user id: ${userId}`);
    } catch (err) {
        console.error(
            `Failed to delete account info from database. Error: ${err}`
        );
        throw err;
    }
};

const getUserCoordinateinRange = async (geoRange) => {
    try {
        const userId = auth.currentUser.uid;
        const q = query(
            collection(db, STR_COLLECTION_USERS),
            and(
                where(STR_FIELD_LAT, ">=", geoRange.northLat),
                where(STR_FIELD_LAT, "<=", geoRange.southLat)
            )
        );
        const qs = await getDocs(q);
        var udatas = [];
        qs.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
            if (
                doc.data().lon >= geoRange.westLon &&
                doc.data().lon <= geoRange.eastLon
            ) {
                if (userId != doc.id) {
                    var udata = { ...doc.data() };
                    udata["id"] = doc.id;
                    udatas.push(udata);
                }
            }
        });
        return udatas;
    } catch (err) {
        console.log(err);
    }
};

const isContainsID = (datas, id) => {
    datas.forEach((d) => {
        if (d.id != undefined && d.id == id) {
            return true;
        }
    });
    return false;
};

const xand = (datas, qy) => {
    const userId = auth.currentUser.uid;
    qy.forEach((doc) => {
        if (!isContainsID(datas, doc.id)) {
            let ndata = { ...doc.data() };
            if (isDataValid(ndata) && userId != doc.id) {
                ndata["id"] = doc.id;
                datas.push(ndata);
            }
        }
    });
};

const getSearchResult = async (keyword) => {
    if (keyword != "") {
        console.log("keyword: ", keyword);
        try {
            const qName = query(
                collection(db, STR_COLLECTION_USERS),
                where(STR_FIELD_NAME, "==", keyword)
            );
            const qPortfolio = query(
                collection(db, STR_COLLECTION_USERS),
                where(STR_FIELD_PORTFOLIO, "==", keyword)
            );
            const qDish = query(
                collection(db, STR_COLLECTION_USERS),
                where(STR_FIELD_DISHES, "array-contains-any", [keyword])
            );
            const qn = await getDocs(qName);
            const qp = await getDocs(qPortfolio);
            // const ql = await getDocs(qLang);
            const qd = await getDocs(qDish);
            var datas = [];
            xand(datas, qn);
            xand(datas, qp);
            // xand(datas, ql);
            xand(datas, qd);
            // console.log("datas : ", datas);
            return datas;
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log("keyword empty");
        return [];
    }
};

const addReservation = async (data) => {
    let dd = Timestamp.fromDate(data.date);
    let updatefield = {
        [STR_FIELD_COOKID]: data.cookid,
        [STR_FIELD_USERID]: auth.currentUser.uid,
        [STR_FIELD_MODE]: data.mode,
        [STR_FIELD_DATETIME]: dd,
        [STR_FIELD_ADDRESS]: data.address,
        [STR_FIELD_PHONE]: data.phone,
    };
    if (data.message !== undefined) {
        updatefield[STR_FIELD_MESSAGE] = data.message;
    }
    if (data.zoom !== undefined) {
        updatefield[STR_FIELD_ZOOM] = data.zoom;
    }
    const docRef = await addDoc(
        collection(db, STR_COLLECTION_RESERVATION),
        updatefield
    );
    console.log("Document written with ID: ", docRef.id);
    updateBooking(docRef.id);
    updateBeingBooking(docRef.id, data.cookid);
};

const updateReservation = async(data, id) => {
    try {
        const userId = auth.currentUser.uid;
        if (!userId) throw Error("User is not logged in");
        const acctInfoRef = doc(db, STR_COLLECTION_RESERVATION, id);
        await updateDoc(acctInfoRef, data);
        console.log(`Reservation info updated for user id: ${userId}`);
    } catch (err) {
        console.error(`Failed to save Reservation info to database. Error: ${err}`);
        err.desc = STR_ERRMSG_UPDATE_ACCT_INFO_FAILURE;
        throw err;
    }
}

const updateBooking = async (id) => {
    const userId = auth.currentUser.uid;
    if (!!!userId) throw Error("User is not logged in");

    const ref = doc(db, STR_COLLECTION_USERS, userId);
    const document = await getDoc(ref);

    if (document.data().bookingId == undefined) {
        await updateDoc(ref, {
            bookingId: [id],
        });
    } else {
        await updateDoc(ref, {
            bookingId: [...document.data().bookingId, id],
        });
    }
};

const updateBeingBooking = async (id, personBeingBookedId) => {
    const ref = doc(db, STR_COLLECTION_USERS, personBeingBookedId);
    const document = await getDoc(ref);

    if (document.data().beingBookedId == undefined) {
        await updateDoc(ref, {
            beingBookedId: [id],
        });
    } else {
        await updateDoc(ref, {
            beingBookedId: [...document.data().beingBookedId, id],
        });
    }
};

const updateExp = async (userId, stars) => {
  try {
    const ref = doc(db, STR_COLLECTION_USERS, userId);
    const document = await getDoc(ref);
    const userData = document.data();
    const currExp = userData[STR_FIELD_EXPERIENCE];
    const currLvl = userData[STR_FIELD_LEVEL];

    let newExp = currExp + stars * 4;
    let newLvl = currLvl;

    if (newExp >= 100) {
      newLvl = currLvl + 1;
      newExp -= 100;
    }

    await updateDoc(ref, {
      [STR_FIELD_EXPERIENCE]: newExp,
      [STR_FIELD_LEVEL]: newLvl,
    });

    console.log(`Updated exp for user ${userId}`);
  } catch (err) {
    console.error(`Unabled to update exp for user ${userId}, ${err}`);
  }
};

const cancelAppointment = async (id, cookID, userID)=>{
    try{
        const reservationRef = doc(db, STR_COLLECTION_RESERVATION, id)
        await deleteDoc(reservationRef)
        const cookRef = doc(db, STR_COLLECTION_USERS, cookID)
        const document = await getDoc(cookRef)
        const appList = document.data().beingBookedId
        const newList = appList.filter((nid)=>{
            return nid != id
        })
        await updateDoc(cookRef, {
            "beingBookedId": newList
        })

        const userRef = doc(db, STR_COLLECTION_USERS, userID)
        const udocument = await getDoc(userRef)
        const uappList = udocument.data().bookingId
        const unewList = uappList.filter((nid)=>{
            return nid != id
        })
        await updateDoc(userRef, {
            "bookingId": unewList
        })
    }catch(err){
        console.log(err)
    }
}

export {
    addAcctInfo,
    deleteAcct,
    getAcctInfo,
    updateAcctInfo,
    getUserCoordinateinRange,
    getSearchResult,
    addReservation,
    updateBooking,
    updateExp,
    updateReservation,
    cancelAppointment,
};
