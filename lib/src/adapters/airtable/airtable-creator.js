import { AirtableAdapter } from './airtable-adapter';

function hasAirtableSignature (adapter) {
  return !!adapter.airtable;
}

const airtableCreator = {
  hasSignature: hasAirtableSignature,
  AdapterClass: AirtableAdapter
};

export { airtableCreator };
