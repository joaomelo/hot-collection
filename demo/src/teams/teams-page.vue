<template>
  <div>
    <AddBar
      item-type="team"
    />
    <ItemsList
      item-type="team"
      :hot-collection="teamsCol"
      :fields="teamsFields"
    />
  </div>
</template>

<script>
import AddBar from '../helpers/add-bar';
import ItemsList from '../helpers/items-list';
import { teamsCol, teamsFields } from './teams-store';

export default {
  name: 'ItemsPage',
  components: { AddBar, ItemsList },
  data () {
    return {
      teamsCol,
      teamsFields
    };
  }
};
</script>
