import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function saveUserAvatar(uid, dataUrl) {
  const user = doc(db, "users", uid);
  await setDoc(user, {avatar: dataUrl}, { merge: true });
}

export async function loadUserAvatar(uid) {
  const user = doc(db, "users", uid);
  const pic = await getDoc(user);
  if (!pic.exists()) return null;
  const data = pic.data();
  return data.avatar || null;
}
