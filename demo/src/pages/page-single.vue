<template>
  <div>
    <AddItem />
    <ListItems />
  </div>
</template>

<script>
import ListItems from '../item/list-items';
import AddItem from '../item/add-item';

export default {
  name: 'PageSingle',
  components: {
    AddItem,
    ListItems
  }
};
</script>
