import Vue from 'vue';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { AuthMachine } from '@joaomelo/fireauth-machine';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const fireapp = firebase.initializeApp(firebaseConfig);
const SHOULD_MOCK = false;
const firedb = SHOULD_MOCK === '' ? 'mock' : fireapp.firestore();

// init auth
const fireauth = fireapp.auth();
const authMachine = new AuthMachine(fireauth);
Vue.observable(authMachine);
// login the default user
authMachine.service.signInWithEmailAndPassword(process.env.USER, process.env.PASS);

export { firebase, fireapp, firedb, authMachine };
