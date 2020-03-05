<template>
  <div>
    <h1 class="text-center">
      Items
    </h1>
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
