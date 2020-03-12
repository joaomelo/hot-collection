import Vue from 'vue';
import VueRouter from 'vue-router';

import { authMachine } from './services';

import PageOverlay from './pages/page-overlay';
import PageRelationship from './pages/page-relationship';
import ItemsCrud from './item/items-crud';
import ItemEdit from './item/item-edit';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: PageOverlay },
  { path: '/items/', component: ItemsCrud },
  { path: '/item/:id', component: ItemEdit, props: true },
  { path: '/relationship', component: PageRelationship }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

authMachine.subscribe(({ status }) => {
  const statusRoutes = {
    UNSOLVED: '/',
    SIGNOUT: '/',
    SIGNIN: '/items'
  };

  const newRoute = statusRoutes[status];
  const oldRoute = router.currentRoute.path;
  if (newRoute !== oldRoute) {
    router.push(newRoute);
  }
});

export { router };
