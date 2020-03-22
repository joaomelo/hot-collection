function createQuery (config) {
  let query = config.collectionReference;
  if (config.orderBy) {
    query = query.orderBy(config.orderBy);
  }

  return query;
}

export { createQuery };
