import { Subject } from 'rxjs';

class Adapter {
  constructor ({ collection, options, adapterUpdateSignal }) {
    this.initState({ collection, options });
    this.setEventDynamics(adapterUpdateSignal);
    this.fireSyntheticServerStateChangedSignal && this.fireSyntheticServerStateChangedSignal(); // will be implemented only if needed
  }

  initState ({ collection, options }) {
    this.options = options;
    this.collection = {
      name: collection
    };
  }

  setEventDynamics (adapterUpdateSignal) {
    // adapters will override this method
    // but calling super before adding the db subscription setup
    this.serverStateChangedSignal = new Subject();
    this.serverStateChangedSignal.subscribe(payload => {
      this
        .promiseDocsFromDatabase(payload)
        .then(docs => {
          if (!docs) return;
          const items = this.convertDocsToItems(docs);
          adapterUpdateSignal.next(items);
        });
    });
  }

  promiseDocsFromDatabase (payload) {
    // most db adapters will just send the
    // docs within the serverStateChangedSignal.
    // this method will be overridden only if an additional
    // call to pull docs from the database is needed.
    // so it works like an optional hook to implement
    // database data loading logic
    return Promise.resolve(payload);
  }

  convertDocsToItems (docs) {
    // hook to adapter override if some especial logic is needed
    return docs.map(doc => {
      const almostItem = this.convertDocToItem(doc);
      const item = this.checkAndReturnConvertionFromDocToItem(almostItem);
      return item;
    });
  }

  convertDocToItem (doc) {
    // a default behavior that docs have id on their root
    // but business data in some inner property
    // just missing the collection property
    // and a safe spread operator to avoid references pollution
    const data = this.extractDocData
      ? this.extractDocData(doc)
      : doc;

    const item = {
      id: doc.id,
      collection: this.collection.name,
      ...data
    };

    return item;
  }

  checkAndReturnConvertionFromDocToItem (almostItem) {
    const item = (this.options.converters && this.options.converters.fromDocToItem)
      ? this.options.converters.fromDocToItem(almostItem)
      : almostItem;
    return item;
  }

  add (item) {
    const doc = this.convertItemToDoc(item);
    // addToDatabase must return a promise with
    // the added document containing the id
    const addPromise = this.addToDatabase(doc);
    addPromise.then(id => {
      this.fireSyntheticServerStateChangedSignal && this.fireSyntheticServerStateChangedSignal(); // will be implemented only if needed
      this.checkAndSaveVersion({ id, ...doc }, 'added');
    });
    return addPromise;
  }

  set (item) {
    const doc = this.convertItemToDoc(item);
    const setPromise = this.setToDatabase(item.id, doc);
    // the promise secure that version will only be saved if the
    // the set operations is suceseful
    setPromise.then(() => {
      this.fireSyntheticServerStateChangedSignal && this.fireSyntheticServerStateChangedSignal(); // will be implemented only if needed
      this.checkAndSaveVersion({ id: item.id, ...doc }, 'set');
    });
    return setPromise;
  }

  update (item) {
    const doc = this.convertItemToDoc(item);
    const setPromise = this.updateToDatabase(item.id, doc);
    // the promise secure that version will only be saved if the
    // the set operations is suceseful
    setPromise.then(() => {
      this.fireSyntheticServerStateChangedSignal && this.fireSyntheticServerStateChangedSignal(); // will be implemented only if needed
      this.checkAndSaveVersion({ id: item.id, ...doc }, 'updated');
    });
    return setPromise;
  }

  del (id) {
    // the promise secure that version will only be saved if the
    // the set operations is suceseful
    const delPromise = this.delInDatabase(id);
    delPromise.then(() => {
      this.fireSyntheticServerStateChangedSignal && this.fireSyntheticServerStateChangedSignal(); // will be implemented only if needed
      this.checkAndSaveVersion({ id }, 'deleted');
    });
    return delPromise;
  }

  convertItemToDoc (item) {
    const doc = this.checkAndReturnConvertionFromItemToDoc({ ...item });
    delete doc.id;
    delete doc.collection;
    return doc;
  }

  checkAndReturnConvertionFromItemToDoc (item) {
    const doc = (this.options.converters && this.options.converters.fromItemToDoc)
      ? this.options.converters.fromItemToDoc(item)
      : item;
    return doc;
  }

  checkAndSaveVersion (data, operation) {
    if (this.options.saveMode !== 'safe') return;

    const version = {
      modified: new Date(),
      source: this.collection.name,
      operation: operation,
      data: JSON.stringify(data)
    };

    return this.addToVersions(version);
  }
}

export { Adapter };
