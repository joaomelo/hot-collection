function createQuery (collection, filters, orderBy) {
  let query = collection;

  if (filters) {
    console.warn('no filters support for now');
  }

  if (orderBy) {
    query = query.orderBy(orderBy);
  }

  return query;
}

export { createQuery };
