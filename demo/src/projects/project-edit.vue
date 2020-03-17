<template>
  <ItemEdit
    v-slot="{ item: project }"
    item-type="project"
    :item-id="id"
    :hot-collection="projectsCol"
  >
    <v-text-field
      v-model="project.title"
      label="Title"
      :rules="[v => !!v || 'Title is required']"
      required
    />
    <v-text-field
      v-model="project.description"
      label="Description"
    />
  </ItemEdit>
</template>

<script>
import ItemEdit from '../helpers/item-edit';
import { projectsCol } from './projects-store';

export default {
  name: 'ProjectEdit',
  components: { ItemEdit },
  props: {
    id: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      projectsCol
    };
  }
};
</script>
