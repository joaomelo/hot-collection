import Airtable from 'airtable';
import { BehaviorSubject } from 'rxjs';

const airtableSubject = new BehaviorSubject(false);

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
if (apiKey && baseId) {
  const airtable = new Airtable({ apiKey, requestTimeout: 60000 });
  const base = airtable.base(baseId);
  airtableSubject.next(base);
};

export { airtableSubject };
