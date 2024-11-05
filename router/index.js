// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../src/home.vue';
import UserLogin from '../src/userLogin.vue';
import UserRegister from '../src/userRegister.vue';
import BandProfile from '../src/bandProfile.vue';
import chooseUserType from '../src/chooseUserType.vue';
import bandLogin from '../src/bandLogin.vue';
import newBandLogin from '../src/newBandLogin.vue';
import newBandRegis from '../src/newBandRegis.vue';
import bandQnComponent from '../src/bandQnComponent.vue';
import bandQnContainer from '../src/bandQnContainer.vue';
import questionContainer from '../src/questionContainer.vue';

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
    path: '/bandProfile', 
    name: 'BandProfile',
    component: BandProfile
  },
  {
    path: '/newBandLogin', 
    name: 'newBandLogin',
    component: newBandLogin
  },
  {
    path: '/newBandRegis', 
    name: 'newBandRegis',
    component: newBandRegis
  },
  {
    path: '/bandQnComponent', 
    name: 'bandQnComponent',
    component: bandQnComponent
  },
  {
    path: '/bandQnContainer', 
    name: 'bandQnContainer',
    component: bandQnContainer
  },
  {
    path: '/questionContainer', 
    name: 'questionContainer',
    component: questionContainer
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
