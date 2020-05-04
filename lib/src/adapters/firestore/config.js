// const SAVE_MODE = {
//   DEFAULT: 'default',
//   SAFE: 'safe'
// };

// export function solveConfig (collection, options) {
//   const config = {};
//   this.state = {
//     db: (typeof db === 'string') ? mockDb : db,
//     saveMode: resolveSaveMode(options),
//     query: {
//       reference: undefined,
//       where: options.where,
//       orderBy: resolveOrderBy(options.orderBy),
//       limit: options.limit
//     },
//     adapters: {
//       itemToDoc: options.adapters && options.adapters.itemToDoc,
//       docToItem: options.adapters && options.adapters.docToItem
//     }
//   };
// }

// export function db () {
//   return this.state.db;}

// export function isSafeMode () {
//   return this.state.saveMode === SAVE_MODE.SAFE;}

// export function queryReference () {
//   if (!this.state.query.reference) {    this.state.query.reference = createQuery(
//       this.collectionReference,
//       this.state.query);
//   }

//   return this.state.query.reference;
// }

// export function itemToDocAdapter () {
//   return this.state.adapters.itemToDoc;}

// export function docToItemAdapter () {
//   return this.state.adapters.docToItem;}

// export function resolveSaveMode (options) {
//   const saveMode = options.saveMode || SAVE_MODE.DEFAULT;  const validSaveModes = Object.values(SAVE_MODE);

//   if (!validSaveModes.includes(saveMode)) {
//     throw new TypeError('saveMode option is invalid');
//   }

//   return saveMode;
// }

// export function resolveOrderBy (orderBy) {
//   if (!orderBy) {    return undefined;
//   };

//   if (typeof orderBy === 'string') {
//     return {
//       field: orderBy,
//       sort: 'asc'
//     };
//   }

//   if (typeof orderBy === 'object') {
//     return {
//       field: orderBy.field,
//       sort: orderBy.sort
//     };
//   }

//   throw new TypeError('oderBy option must be a String or Object');
// }
