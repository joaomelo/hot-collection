import Vue from 'vue';
import VueRouter from 'vue-router';

import { authMachine } from './services';

import PageOverlay from './pages/page-overlay';
import ItemsPage from './items/items-page';
import ItemEdit from './items/item-edit';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: PageOverlay },
  { path: '/pages/:collectionType', component: ItemsPage, props: true },
  { path: '/item/:collectionType/:itemId', component: ItemEdit, props: true }
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
    SIGNIN: '/pages/projects'
  };

  const newRoute = statusRoutes[status];
  const oldRoute = router.currentRoute.path;
  if (newRoute !== oldRoute) {
    router.push(newRoute);
  }
});

export { router };
