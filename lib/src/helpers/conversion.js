function convertSnapshotToItems (snapshot, adapter) {
  const docs = snapshot.docs;
  const items = docs.map(doc => convertDocToItem(doc, adapter));
  return items;
}

function convertDocToItem (doc, adapter) {
  const docData = { ...doc.data() };
  const itemData = adapter ? adapter(docData) : docData;
  const item = { id: doc.id, ...itemData };
  return item;
}

function convertItemToDoc (item, adapter) {
  const itemData = { ...item };
  delete itemData.id;
  const doc = adapter ? adapter(itemData) : itemData;
  return doc;
}

export { convertSnapshotToItems, convertDocToItem, convertItemToDoc };
