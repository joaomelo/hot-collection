import { LocalStorageAdapter } from './local-storage-adapter';

function hasLocalStorageSignature (adapter) {
  return !!adapter.localStorage;
}

const localStorageCreator = {
  hasSignature: hasLocalStorageSignature,
  AdapterClass: LocalStorageAdapter
};

export { localStorageCreator };
