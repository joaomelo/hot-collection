import { Subject } from 'rxjs';

class Adapter {
  constructor ({ collection, options, collectionUpdatedSignal }) {
    this.options = options;
    this.collection = {
      name: collection
    };
    this.serverFinishedUpdate = new Subject();
    this.serverFinishedUpdate.subscribe(docs => {
      const items = this.processDocsToItems(docs);
      collectionUpdatedSignal.next(items);
    });
    this.initialization({ collection, options, collectionUpdatedSignal }); // setup other assignments before listening
    this.startListeningToServer(); // setup how the adapter nows and triggers new data versions on sever
    this.fireSyntheticServerUpdateSignal && this.fireSyntheticServerUpdateSignal(); // will be implemented only if needed
  }

  convertItemToDoc (item) {
    const doc = this.checkAndReturnFromItemToDoc({ ...item });
    delete doc.id;
    delete doc.collection;
    return doc;
  }

  checkAndReturnFromDocToItem (almostItem) {
    const item = (this.options.converters && this.options.converters.fromDocToItem)
      ? this.options.converters.fromDocToItem(...almostItem)
      : almostItem;
    return item;
  }

  checkAndReturnFromItemToDoc (item) {
    const doc = (this.options.converters && this.options.converters.fromItemToDoc)
      ? this.options.converters.fromItemToDoc(item)
      : item;
    return doc;
  }
}

export { Adapter };
