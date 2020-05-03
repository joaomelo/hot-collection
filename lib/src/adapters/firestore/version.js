import { convertItemToDoc } from './conversion';

const VERSION_COLLECTION = 'versions';

function saveVersion (hotCollection, item) {
  const versionDoc = createVersionDoc(hotCollection, item);

  return hotCollection
    .config
    .collectionReference
    .doc(item.id)
    .collection(VERSION_COLLECTION)
    .add(versionDoc);
}

function createVersionDoc (hotCollection, item) {
  const trail = createTrail(hotCollection);
  const doc = convertItemToDoc(item, hotCollection.config.itemToDocAdapter);
  const versionDoc = { ...doc, ...trail };
  return versionDoc;
}

function createTrail (hotCollection) {
  const trail = {
    // could not find a way to access the static method FieldValue.serverTimestamp()
    // starting at the firestore instante => hotCollection.config.db.FieldValue.serverTimestamp()
    __modifiedAt: new Date()
  };

  const user = hotCollection.config.db.app.auth().currentUser;
  if (user) {
    trail.__modifiedBy = `${user.uid} (${user.email})`;
  }

  return trail;
}

export { saveVersion };
