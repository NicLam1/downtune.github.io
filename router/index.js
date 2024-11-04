// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../src/home.vue';
import UserLogin from '../src/userLogin.vue';
import UserRegister from '../src/userRegister.vue';
import BandProfile from '../src/bandProfile.vue';
import chooseUserType from '../src/chooseUserType.vue';
import bandLogin from '../src/bandLogin.vue';
import Calendar from  '../src/Calendar.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login/user',
    name: 'UserLogin',
    component: UserLogin 
  },
  {
    path: '/register/user',
    name: 'UserRegister',
    component: UserRegister
  },
  {
    path: '/choose',
    name: 'chooseUserType',
    component: chooseUserType
  },
  {
    path: '/login/band',
    name: 'bandLogin',
    component: bandLogin
  },
  {
    path: '/band', 
    name: 'BandProfile',
    component: BandProfile
  },
  {
    path: '/calendar', 
    name: 'Calendar',
    component: Calendar
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
