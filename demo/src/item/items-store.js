import HotCollection from '__lib';

import { firedb } from '../services';
const itemsCol = new HotCollection(firedb, 'items');

export { itemsCol };
