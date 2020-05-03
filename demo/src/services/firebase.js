import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

const firestoreSubject = new BehaviorSubject(false);

const firebaseConfig = !process.env.FIREBASE_API_KEY ? null : {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

if (firebaseConfig) {
  const fireapp = firebase.initializeApp(firebaseConfig);
  const firestore = fireapp.firestore();

  const auth = fireapp.auth();
  auth.signInWithEmailAndPassword(process.env.FIREBASE_USER, process.env.FIREBASE_PASS);
  auth.onAuthStateChanged(user => {
    firestoreSubject.next(user ? firestore : false);
  });
};

export { firestoreSubject };
