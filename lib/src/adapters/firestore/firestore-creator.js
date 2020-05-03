import { FirestoreAdapter } from './firestore-adapter';

function hasFirestoreSignature (adapter) {
  return !!adapter.firestore;
}

const firestoreCreator = {
  hasSignature: hasFirestoreSignature,
  AdapterClass: FirestoreAdapter
};

export { firestoreCreator };
