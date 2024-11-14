// src/authState.js
import { ref } from 'vue';
import { auth } from './firebaseConfig'; // Adjust the path as necessary
import { onAuthStateChanged } from 'firebase/auth';

export const isLoggedIn = ref(null);
export const userId = ref(null);
export const displayName = ref(null);

export const setLoginState = (state, id = null, name = null) => {
  isLoggedIn.value = state;
  userId.value = id;
  displayName.value = name;
};

export const initializeAuthState = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      displayName.value = user.displayName;
    } else {
      isLoggedIn.value = 'notloggedin';
      displayName.value = null;
    }
  });
};