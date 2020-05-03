import { Subject } from 'rxjs';

class Adapter {
  constructor ({ collection, options, collectionUpdatedSubject }) {
    this.options = options;
    this.collection = {
      name: collection
    };
    this.serverFinishedUpdate = new Subject();
    this.serverFinishedUpdate.subscribe(docs => {
      const items = this.processDocsToItems(docs);
      collectionUpdatedSubject.next(items);
    });
    this.initialization({ collection, options, collectionUpdatedSubject }); // setup other assignments before listening
    this.startListeningToServer(); // setup how the adapter nows and triggers new data versions on sever
    this.fireSyntheticServerUpdateSignal && this.fireSyntheticServerUpdateSignal(); // will be implemented only if needed
  }
}

export { Adapter };
