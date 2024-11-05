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
            <a class="nav-link" href="#">Discover</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Bands</a>
          </li>
          <li class="nav-item">
            <router-link to="/calendar" class="nav-link">Events</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link">Contact</a>
          </li>
          <li class="nav-item">
            <button class="nav-link btn auth-button" @click="handleAuth">{{ isLoggedIn ? 'Logout' : 'Login' }}</button>
          </li>
        </ul>
        <!-- Login button on the right -->
        <div class="user-section">
          <div v-if="loggedInUser" class="logged-in-info">
            <p class="text-light">Welcome, {{ loggedInUser }}!</p>
          </div>
          <div v-else class="login-button">
            <router-link to="/choose">
              <button class="btn btn-primary"><i class="fas fa-sign-in-alt"></i> Log In</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed, inject } from 'vue';
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

    const isCalendarPage = computed(() => route.name === 'Calendar');

    const handleAuth = async () => {
      if (isLoggedIn.value) {
        await signOut(auth);
        setLoginState(false);
        router.push('/'); // Redirect to home page
      } else {
        router.push('/choose'); // Redirect to login page
      }
    };

    return {
      isCalendarPage,
      isLoggedIn,
      handleAuth
    };
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

@media (prefers-color-scheme: light) {
  .custom-navbar {
    background: linear-gradient(to right, #ffffff, #eeeeee);
  }

  .nav-title,
  .navbar-nav .nav-link {
    color: #213547;
  }

  .nav-link:hover {
    color: #747bff;
  }
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

.login-button .btn {
  font-family: "Poppins", sans-serif;
}

a.router-link-active{
  color: #ff7e5f;
}
</style>
