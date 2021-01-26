import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../components/Home.vue';
import Build from '../components/Build.vue';

Vue.use(VueRouter);

const routes = [{
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/dataload',
    name: 'Build',
    component: Build,
  },
];

const router = new VueRouter({
  routes,
});

export default router;