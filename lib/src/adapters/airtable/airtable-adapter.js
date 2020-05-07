import { Adapter } from '../adapter';
import { requestUnderLimit } from './rate-limiter';

class AirtableAdapter extends Adapter {
  initState ({ collection, options }) {
    super.initState({ collection, options });
    this.db = options.adapter.airtable;
    this.collection.reference = this.db(this.collection.name);
    this.query = this.collection.reference.select(options.query || {});
  }

  promiseDocsFromDatabase () {
    const docs = [];
    const queryPromise = this.query
      .eachPage((records, fetchNextPage) => {
        records.forEach(r => docs.push(r));
        fetchNextPage();
      })
      .then(() => docs);
    return queryPromise;
  }

  fireSyntheticServerStateChangedSignal () {
    this.serverStateChangedSignal.next();
  }

  extractDocData (doc) {
    return doc.fields;
  }

  addToDatabase (doc) {
    const create = () => this.collection.reference.create(doc, { typecast: true }).then(record => record.id);
    return requestUnderLimit(create);
  }

  setToDatabase (id, doc) {
    const replace = () => this.collection.reference.replace(id, doc, { typecast: true });
    return requestUnderLimit(replace);
  }

  updateToDatabase (id, doc) {
    const update = () => this.collection.reference.update(id, doc, { typecast: true });
    return requestUnderLimit(update);
  }

  delInDatabase (id) {
    const destroy = () => this.collection.reference.destroy(id);
    return requestUnderLimit(destroy);
  }

  addToVersions (version) {
    const versionCollection = this.db('versions');
    const addVersion = () => versionCollection.create(version, { typecast: true });
    return requestUnderLimit(addVersion);
  }
}

export { AirtableAdapter };
