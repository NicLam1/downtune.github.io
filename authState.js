// src/authState.js
import { ref } from 'vue';

export const isLoggedIn = ref(false);

export const setLoginState = (state) => {
  isLoggedIn.value = state;
};