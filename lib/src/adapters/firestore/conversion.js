function convertItemToDoc (item, adapter) {
  const itemData = { ...item };
  delete itemData.id;
  const doc = adapter ? adapter(itemData) : itemData;
  return doc;
}

export { convertItemToDoc };
