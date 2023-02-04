import { doc, getDoc } from "@firebase/firestore";
import { db } from "../firebaseConfig";

const getUserDisplayNameWithUid = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const user = await getDoc(userRef);
  if (user.data() && user.exists()) {
    return user.data().displayName;
  }
  return undefined;
};

export default getUserDisplayNameWithUid;
