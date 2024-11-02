// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../src/home.vue';
import UserLogin from '../src/userLogin.vue';
import UserRegister from '../src/userRegister.vue';
import BandProfile from '../src/bandProfile.vue'
import chooseUserType from '../src/chooseUserType.vue';
import bandLogin from '../src/bandLogin.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: UserLogin 
  },
  {
    path: '/register',
    name: 'Register',
    component: UserRegister
  },
  {
    path: '/chooseUserType',
    name: 'chooseUserType',
    component: chooseUserType
  },
  {
    path: '/bandLogin',
    name: 'bandLogin',
    component: bandLogin
  },
  {
    path: '/band', 
    name: 'BandProfile',
    component: BandProfile
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
