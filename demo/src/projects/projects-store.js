import HotCollection from '__lib';

import { firedb } from '../services';

const projectsCol = new HotCollection(firedb, 'projects');
const projectsFields = ['title', 'description'];

export { projectsCol, projectsFields };
