import Vue from 'vue';
import VueRouter from 'vue-router';

import { authMachine } from './services';

import PageOverlay from './pages/page-overlay';
import ProjectsPage from './projects/projects-page';
import ProjectEdit from './projects/project-edit';
import TeamsPage from './teams/teams-page';
import TeamEdit from './teams/team-edit';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: PageOverlay },
  { path: '/projects/', component: ProjectsPage },
  { path: '/project/:id', component: ProjectEdit, props: true },
  { path: '/teams/', component: TeamsPage },
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
    SIGNIN: '/projects'
  };

  const newRoute = statusRoutes[status];
  const oldRoute = router.currentRoute.path;
  if (newRoute !== oldRoute) {
    router.push(newRoute);
  }
});

export { router };
