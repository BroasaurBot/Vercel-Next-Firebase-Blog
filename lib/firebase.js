import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB-UZDw4ri7ZillUnPcnseecy8Ze6gmJFs",
  authDomain: "fire-blogger-814c7.firebaseapp.com",
  projectId: "fire-blogger-814c7",
  storageBucket: "fire-blogger-814c7.appspot.com",
  messagingSenderId: "803984393835",
  appId: "1:803984393835:web:846be6a3a604139e8a932e",
  measurementId: "G-S3T78F3JGE"
};

if(!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const increment = firebase.firestore. FieldValue.increment;
export const storage = firebase.storage();  
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export async function getUserWithUsername(username) {
  const userRef = firestore.collection('users');
  const query = userRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}