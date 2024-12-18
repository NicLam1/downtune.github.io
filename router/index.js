// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../src/home.vue";
import UserLogin from "../src/userLogin.vue";
import UserRegister from "../src/userRegister.vue";
import BandProfile from "../src/BandProfile.vue";
import chooseUserType from "../src/chooseUserType.vue";
import Calendar from "../src/Calendar.vue";
import CalendarGuitar from "../src/CalendarGuitar.vue";
import newBandLogin from "../src/newBandLogin.vue";
import newBandRegis from "../src/newBandRegis.vue";
import Favorite from "../src/Favorite.vue";
import UserProfile from "../src/UserProfile.vue";
import forgotPassword from "../src/forgotPassword.vue";
import bandLoginFake from "../src/bandLoginFake.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/favorites",
    name: "Favorite",
    component: Favorite,
  },
  {
    path: "/login/user",
    name: "UserLogin",
    component: UserLogin,
  },
  {
    path: "/register/user",
    name: "UserRegister",
    component: UserRegister,
  },
  {
    path: "/choose",
    name: "chooseUserType",
    component: chooseUserType,
  },
  {
    path: "/login/band",
    name: "bandLogin",
    component: newBandLogin,
  },
  {
    path: "/band/:id",
    name: "BandProfile",
    component: BandProfile,
    props: true,
  },
  {
    path: "/register/band",
    name: "bandRegister",
    component: newBandRegis,
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: Calendar,
  },
  {
    path: "/calendar2",
    name: "CalendarGuitar",
    component: CalendarGuitar,
  },
  {
    path: "/account",
    name: "account",
    component: UserProfile,
  },
  {
    path: "/forgotPassword",
    name: "forgotPassword",
    component: forgotPassword,
  },
  {
    path: "/notImplemented",
    name: "notImplemented",
    component: bandLoginFake,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to the top
    return { top: 0 };
  },
});

export default router;
