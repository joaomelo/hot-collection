<template>
  <div>
    <AddBar
      item-type="project"
    />
    <ItemsList
      item-type="project"
      :hot-collection="projectsCol"
      :fields="projectsFields"
    />
  </div>
</template>

<script>
import AddBar from '../helpers/add-bar';
import ItemsList from '../helpers/items-list';
import { projectsCol, projectsFields } from './projects-store';

export default {
  name: 'ProjectsPage',
  components: { AddBar, ItemsList },
  data () {
    return {
      projectsCol,
      projectsFields
    };
  }
};
</script>
