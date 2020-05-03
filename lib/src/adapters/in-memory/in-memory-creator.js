import { InMemoryAdapter } from './in-memory-adapter';

function hasInMemorySignature (adapter) {
  return adapter === 'in-memory';
}

const inMemoryCreator = {
  hasSignature: hasInMemorySignature,
  AdapterClass: InMemoryAdapter
};

export { inMemoryCreator };
