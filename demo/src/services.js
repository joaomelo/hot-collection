import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

let db, userPromise;

if (process.env.FIREBASE_API_KEY) {
  const fireapp = firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  });
  db = fireapp.firestore();
  userPromise = fireapp.auth().signInWithEmailAndPassword(process.env.USER, process.env.PASS);
} else {
  db = 'mock';
  userPromise = new Promise((resolve, reject) => resolve({ name: 'mock', email: 'mock@mock.br' }));
};

export { db, userPromise };
