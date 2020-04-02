import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const SHOULD_MOCK = false;

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

// init firestore
const db = SHOULD_MOCK ? 'mock' : fireapp.firestore();

// init auth
const fireauth = fireapp.auth();
const mockUser = async () => ({ name: 'mock', email: 'mock@mock.br' });
const userPromise = SHOULD_MOCK ? mockUser() : fireauth.signInWithEmailAndPassword(process.env.USER, process.env.PASS);

export { db, userPromise };
