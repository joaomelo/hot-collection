import Vue from 'vue';
import VueRouter from 'vue-router';

import { authMachine } from './services';

import PageOverlay from './pages/page-overlay';
import PageRelationship from './pages/page-relationship';
import PageSingle from './pages/page-single';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: PageOverlay },
  { path: '/single', component: PageSingle },
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
    SIGNIN: '/single'
  };

  const newRoute = statusRoutes[status];
  const oldRoute = router.currentRoute.path;
  if (newRoute !== oldRoute) {
    router.push(newRoute);
  }
});

export { router };
