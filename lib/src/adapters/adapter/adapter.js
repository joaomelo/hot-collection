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
}

export { Adapter };
