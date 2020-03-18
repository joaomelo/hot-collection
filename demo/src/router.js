import Vue from 'vue';
import VueRouter from 'vue-router';

import { authMachine } from './services';

import PageOverlay from './pages/page-overlay';
import ItemsPage from './items/items-page';
import ProjectEdit from './projects/project-edit';
import TeamEdit from './teams/team-edit';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: PageOverlay },
  { path: '/pages/:itemsType', component: ItemsPage, props: true },
  { path: '/project/:id', component: ProjectEdit, props: true },
  { path: '/team/:id', component: TeamEdit, props: true }
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
