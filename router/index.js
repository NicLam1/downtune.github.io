// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../src/home.vue';
import UserLogin from '../src/userLogin.vue';
import UserRegister from '../src/userRegister.vue';
import BandProfile from '../src/bandProfile.vue';
import chooseUserType from '../src/chooseUserType.vue';
import newBandLogin from '../src/newBandLogin.vue';
import newBandRegis from '../src/newBandRegis.vue';


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
    component: newBandLogin
  },
  {
    path: '/bandProfile', 
    name: 'BandProfile',
    component: BandProfile
  },
  {
    path: '/register/band', 
    name: 'bandRegister',
    component: newBandRegis
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
