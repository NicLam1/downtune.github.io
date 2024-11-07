<template>
  <nav class="navbar navbar-expand-lg custom-navbar" :class="{ 'custom-navbar-sticky-for-calendar': isCalendarPage }">
    <div class="container-fluid">
      <div class="navbar-brand">
        <router-link to="/" class="nav-title">Downtune</router-link>
      </div>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- Updated navbar-collapse -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <!-- Navigation links on the left -->
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/calendar" class="nav-link">Events</router-link>
          </li>
        </ul>
        <!-- Profile dropdown on the right -->
        <div v-if="displayName" class="logged-in-info mx-4 text-light fs-bold">
            Welcome, {{displayName}}!
          </div>
        <div class="user-section">
          
          <div v-if="displayName" class="logged-in-info">
            <div class="dropdown">
              <img src="../public/band/image (1).jpg" alt="Profile" class="profile-icon" @click="toggleDropdown">
              <div v-if="dropdownVisible" class="dropdown-menu show">
                <router-link to="/account" class="dropdown-item">My Account</router-link>
                <router-link to="/favorites" class="dropdown-item">Favourites</router-link>
                <button class="dropdown-item" @click="handleAuth">Logout</button>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="dropdown">
              <img src="../public/band/image (1).jpg" alt="Profile" class="profile-icon" @click="toggleDropdown">
              <div v-if="dropdownVisible" class="dropdown-menu show">
                <router-link to="/choose" class="dropdown-item">Login / Sign Up</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed, inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { auth } from '../firebaseConfig'; // Adjust the path as necessary
import { signOut } from 'firebase/auth';

export default {
  name: "Nav",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isLoggedIn = inject('isLoggedIn');
    const setLoginState = inject('setLoginState');
    const displayName = inject('displayName');
    const dropdownVisible = ref(false);

    const toggleDropdown = () => {
      dropdownVisible.value = !dropdownVisible.value;
    };

    const handleAuth = async () => {
      if (isLoggedIn.value) {
        await signOut(auth);
        setLoginState(false);
        router.push('/'); // Redirect to home page
        location.reload
      } else {
        router.push('/choose'); // Redirect to login page
      }
    };

    return {
      isLoggedIn,
      displayName,
      handleAuth,
      toggleDropdown,
      dropdownVisible
    };
  },
  computed: {
  isCalendarPage() {
    return this.$route.name === 'calendar'; // Adjust based on your routing logic
  }
}

};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");

.custom-navbar {
  background: linear-gradient(to right, #240244, #100014);
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  padding: 1em;
  position: relative; /* Ensure z-index works */
  z-index: 100000000; /* Higher z-index to appear above the background */
}

.custom-navbar-sticky-for-calendar {
  z-index: 100000000;
  position: sticky;
  top: 0;
  /* Make sure z index is high so it works for the calendar / event page */
}

.nav-title {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  color: #feb47b;
  /* Using the accent color for a pop */
  font-size: 1.5rem;
  text-decoration: none;
}

.navbar-nav .nav-link {
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  color: #f0f0f0;
  margin: 0 0.8em;
  transition: color 0.3s;
}

.navbar-nav .nav-link:hover {
  color: #ff7e5f;
  /* A more noticeable color on hover */
}

.navbar-toggler {
  border: none;
  background-color: rgba(255, 255, 255, 0.3);
}

.navbar-toggler-icon {
  filter: invert(1);
}

router-link a {
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #d900ff, #7500e8);
  border: none;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #ff66ff, #c603ff);
}

/* Additional styling for alignment */
.user-section {
  display: flex;
  align-items: center;
}

.logged-in-info p {
  margin: 0;
  font-family: "Poppins", sans-serif;
  color: #f0f0f0;
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.profile-icon:hover {
  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
}

.dropdown-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background: #240244;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 0.5em 1em;
  z-index: 100000000;
}

.dropdown-item {
  color: #f0f0f0;
  font-family: "Poppins", sans-serif;
  padding: 0.5em 0;
  text-decoration: none;
  display: block;
  transition: color 0.3s;
}

.dropdown-item:hover {
  color: #ff7e5f;
  background: #240244;
}

a.router-link-active {
  color: #ff7e5f;
}
</style>
