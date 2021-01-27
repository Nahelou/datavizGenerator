import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../components/Home.vue';
import Parse from '../components/Parse.vue';
import Build from '../components/Build.vue';

Vue.use(VueRouter);

const routes = [{
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/dataparser',
    name: 'Parse',
    component: Parse,
  },
  {
    path: '/build',
    name: 'Build',
    component: Build,
    props: true,
  },
];

const router = new VueRouter({
  routes,
});

export default router;