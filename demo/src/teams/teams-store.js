import HotCollection from '__lib';

import { firedb } from '../services';

const teamsCol = new HotCollection(firedb, 'teams');
const teamsFields = ['name'];

export { teamsCol, teamsFields };
