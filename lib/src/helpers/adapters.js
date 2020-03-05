function convertDocToItem (doc) {
  const item = {
    id: doc.id,
    ...doc.data()
  };
  return item;
}

function convertItemToDoc (item) {
  const doc = { ...item };
  delete doc.id;

  return doc;
}

export { convertDocToItem, convertItemToDoc };
