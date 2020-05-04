import { inMemoryCreator } from './in-memory';
import { localStorageCreator } from './local-storage';
import { airtableCreator } from './airtable';
import { firestoreCreator } from './firestore';

function resolveAdapter ({ collection, options, collectionUpdatedSignal }) {
  const { adapter } = options;

  const creators = [inMemoryCreator, localStorageCreator, airtableCreator, firestoreCreator];
  const AdapterClass = creators.reduce((acc, creator) => creator.hasSignature(adapter) ? creator.AdapterClass : acc, null);

  if (!AdapterClass) {
    throw new TypeError('must pass a valid adapter');
  }

  return new AdapterClass({ collection, options, collectionUpdatedSignal });
}

export { resolveAdapter };
