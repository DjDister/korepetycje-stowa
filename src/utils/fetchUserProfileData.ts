import { Firestore, doc, getDoc } from "firebase/firestore";
import converter from "./converter";

import { UserProfileData } from "../types";

const fetchUserProfileData = async (id: string, db: Firestore) => {
  const docRef = doc(db, "users", id).withConverter(
    converter<UserProfileData>()
  );
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export default fetchUserProfileData;
