function createQuery (collection, { where, orderBy, limit }) {
  let query = collection;

  if (where && Array.isArray(where)) {
    where.forEach(f => {
      query = query.where(f.field, f.operator, f.value);
    });
  }

  if (orderBy) {
    query = query.orderBy(orderBy.field, orderBy.sort);
  }

  if (limit) {
    query = query.limit(limit);
  }

  return query;
}

export { createQuery };
