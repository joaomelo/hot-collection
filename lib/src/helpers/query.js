function createQuery (collection, where, orderBy) {
  let query = collection;

  if (where && Array.isArray(where)) {
    where.forEach(f => {
      query = query.where(f.field, f.operator, f.value);
    });
  }

  if (orderBy) {
    query = query.orderBy(orderBy);
  }

  return query;
}

export { createQuery };
