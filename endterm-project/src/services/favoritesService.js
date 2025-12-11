import { db } from "../firebase";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

function favoritesCollection(uid) {
  return collection(db, "users", uid, "favorites");
}

export async function loadFavoritesForUser(uid) {
  const snap = await getDocs(favoritesCollection(uid));
  return snap.docs.map((d) => d.data());
}

export async function saveFavoriteForUser(uid, character) {
  const ref = doc(db, "users", uid, "favorites", String(character.id));
  await setDoc(ref, character);
}

export async function removeFavoriteForUser(uid, characterId) {
  const ref = doc(db, "users", uid, "favorites", String(characterId));
  await deleteDoc(ref);
}
