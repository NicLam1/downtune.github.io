<template>
    <div class="user-profile">
      <h1>User Profile</h1>
      <div v-if="preferences">
        <h3>Event Preferences</h3>
        <p><strong>Genres:</strong> {{ preferences.genres.join(', ') }}</p>
        <p><strong>Event Type:</strong> {{ preferences.eventType }}</p>
        <p><strong>Budget:</strong> {{ preferences.budget }}</p>
        <p><strong>Event Duration:</strong> {{ preferences.eventDuration }}</p>
        <p><strong>Event Location:</strong> {{ preferences.eventLocation }}</p>
      </div>
      <div v-else>
        <p>Loading preferences...</p>
      </div>
    </div>
  </template>
  
  <script>
  import { onAuthStateChanged } from 'firebase/auth';
  import { doc, getDoc } from 'firebase/firestore';
  import { auth, db } from '../firebaseConfig';
  
  export default {
    data() {
      return {
        preferences: null,
      };
    },
    mounted() {
      this.checkAuthState();
    },
    methods: {
      checkAuthState() {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            this.fetchUserPreferences(user.uid);
          } else {
            console.error("No user is currently signed in.");
          }
        });
      },
      async fetchUserPreferences(userId) {
        try {
          const docRef = doc(db, 'userPreferences', userId);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            this.preferences = docSnap.data();
          } else {
            console.error('No preferences found for this user.');
          }
        } catch (error) {
          console.error('Error retrieving preferences:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .user-profile {
    padding: 20px;
    color: white;
  }
  </style>
  