<template>
  <nav
    class="navbar navbar-expand-lg custom-navbar"
    :class="{ 'custom-navbar-sticky-for-calendar': isCalendarPage }"
  >
    <div class="container-fluid">
      <div class="d-flex align-items-center justify-content-between w-100">
        <div class="navbar-brand d-flex align-items-center">
          <!-- Placeholder Logo Image -->
          <img src="/Logo.png" alt="Logo" class="logo-image me-2" />
          <router-link to="/" class="nav-title">Downtune</router-link>
        </div>
        <!-- Navigation links for large screens -->
        <ul class="navbar-nav me-auto d-none d-lg-flex">
          <li class="nav-item">
            <router-link
              to="/"
              class="nav-link"
              activeClass="router-link-active"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/calendar" class="nav-link">Events</router-link>
          </li>
        </ul>
        <div class="d-flex align-items-center">
          <!-- Navbar toggler -->
          <button
            class="navbar-toggler me-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i class="fas fa-bars toggler-icon"></i>
          </button>
          <!-- User section for small screens -->
          <div class="user-section d-flex align-items-center d-lg-none ms-2">
            <!-- If user is logged in -->
            <div v-if="displayName" class="logged-in-info">
              <div class="dropdown">
                <i
                  class="fas fa-user-circle profile-icon"
                  @click="toggleDropdown"
                ></i>
                <div
                  v-if="dropdownVisible"
                  class="dropdown-menu show"
                  ref="dropdownMenu"
                >
                  <router-link
                    to="/account"
                    class="dropdown-item"
                    @click="closeDropdown"
                  >
                    My Account
                  </router-link>
                  <router-link
                    to="/favorites"
                    class="dropdown-item"
                    @click="closeDropdown"
                  >
                    Favourites
                  </router-link>
                  <button class="dropdown-item" @click="handleAuth">
                    Logout
                  </button>
                </div>
              </div>
            </div>
            <div v-else-if="displayName == null && isLoggedIn == null" >
              <div class="dropdown">
                
                <router-link to="/choose" class="nav-link"><i
                  class="fas fa-user-circle profile-icon"
                ></i></router-link>
                <!-- <div
                  v-if="dropdownVisible"
                  class="dropdown-menu show"
                  ref="dropdownMenu"
                >
                 -->
                  <!-- <router-link
                    to="/login/user"
                    class="dropdown-item"
                    @click="closeDropdown"
                  >
                    <i class="fas fa-sign-in-alt me-1"></i> Login
                  </router-link>
                  <router-link
                    to="/login/user"
                    class="dropdown-item"
                    @click="closeDropdown"
                  >
                    <i class="fas fa-user-plus me-1"></i> Sign Up
                  </router-link> -->
                <!-- </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Navbar collapse -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <!-- Navigation links for small screens -->
        <ul class="navbar-nav me-auto d-lg-none">
          <li class="nav-item">
            <router-link
              to="/"
              class="nav-link"
              activeClass="router-link-active"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/calendar" class="nav-link">Events</router-link>
          </li>
        </ul>
        <!-- User section for large screens -->
        <div
          class="user-section d-flex align-items-center ms-auto d-none d-lg-flex"
        >
          <div
            v-if="displayName"
            class="logged-in-info mx-4 text-light fw-bold"
          >
            Welcome, {{ displayName }}!
          </div>
          <div  v-if="displayName && isLoggedIn !== null"
          class="logged-in-info">
            <div class="dropdown">
              <i
                class="fas fa-user-circle profile-icon"
                @click="toggleDropdown"
              ></i>
              <div
                v-if="dropdownVisible"
                class="dropdown-menu show"
                ref="dropdownMenu"
              >
                <router-link
                  to="/account"
                  class="dropdown-item"
                  @click="closeDropdown"
                >
                  My Account
                </router-link>
                <router-link
                  to="/favorites"
                  class="dropdown-item"
                  @click="closeDropdown"
                >
                  Favourites
                </router-link>
                <button class="dropdown-item" @click="handleAuth">
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div v-else-if="displayName == null && isLoggedIn == null"  class="auth-buttons d-flex align-items-center">
            <button
              class="btn btn-primary me-2 d-flex align-items-center"
              > 
              <router-link to="/choose" class="nav-link"> <i class="fas fa-sign-in-alt me-1"></i>
              <span>Login / </span><i class="fas fa-user-plus me-1"></i>
              <span>Sign Up</span></router-link>
            </button>
           
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { inject, ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { auth } from "../firebaseConfig"; // Adjust the path as necessary
import { signOut } from "firebase/auth";
import { initializeAuthState } from "/authState.js"; 

export default {
  name: "Nav",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isLoggedIn = inject("isLoggedIn");
    const setLoginState = inject("setLoginState");
    const displayName = inject("displayName");
    const dropdownVisible = ref(false);
    const dropdownMenu = ref(null);

    const toggleDropdown = () => {
      dropdownVisible.value = !dropdownVisible.value;
    };

    const closeDropdown = () => {
      dropdownVisible.value = false;
    };

    const handleAuth = async () => {
      if (isLoggedIn.value) {
        await signOut(auth);
        setLoginState(false);
        router.push("/"); // Redirect to home page
      } else {
        router.push("/choose"); // Redirect to login page
      }
    };

    const navigateTo = (page) => {
      router.push(`/${page}`);
    };

    // Detect clicks outside the dropdown to close it
    const handleClickOutside = (event) => {
      const profileIcons = document.querySelectorAll(".profile-icon");
      const clickedOnProfileIcon = Array.from(profileIcons).some((icon) =>
        icon.contains(event.target)
      );
      if (
        dropdownMenu.value &&
        !dropdownMenu.value.contains(event.target) &&
        !clickedOnProfileIcon
      ) {
        closeDropdown();
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      isLoggedIn,
      displayName,
      handleAuth,
      toggleDropdown,
      dropdownVisible,
      closeDropdown,
      dropdownMenu,
      navigateTo,
    };
  },
  computed: {
    isCalendarPage() {
      return (
        this.$route.name === "Calendar" || this.$route.name === "CalendarGuitar"
      ); // Adjust based on your routing logic
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");

.custom-navbar {
  background: linear-gradient(to right, #240244, #100014);
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  padding: 1em;
  position: relative;
  z-index: 100000000;
}

.custom-navbar-sticky-for-calendar {
  z-index: 100000000;
  position: fixed;
  top: 0;
  width: 100%;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo-image {
  width: 40px; /* Adjust size as needed */
  height: auto;
}

.nav-title {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  color: #feb47b;
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
}

.navbar-toggler {
  border: none;
  background: none;
}

.toggler-icon {
  color: #d900ff;
  font-size: 1.8rem;
}

router-link a {
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #d900ff, #7500e8);
  border: none;
  transition: background-color 0.3s;
  color: #ffffff;
  white-space: nowrap; /* Prevent text from wrapping */
}

.btn-primary:hover {
  background: linear-gradient(135deg, #ff66ff, #c603ff);
}

.btn-secondary {
  background: linear-gradient(135deg, #7500e8, #d900ff);
  border: none;
  transition: background-color 0.3s;
  color: #ffffff;
  white-space: nowrap; /* Prevent text from wrapping */
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #c603ff, #ff66ff);
}

/* Additional styling for alignment */
.user-section {
  display: flex;
  align-items: center;
  flex-wrap: nowrap; /* Prevent wrapping */
}

.logged-in-info p {
  margin: 0;
  font-family: "Poppins", sans-serif;
  color: #f0f0f0;
}

.logged-in-info.mx-4.text-light.fw-bold {
  white-space: nowrap;
}

.profile-icon {
  font-size: 1.8rem;
  color: #ff7e5f;
  cursor: pointer;
  transition: color 0.3s;
}

.profile-icon:hover {
  color: #d900ff;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: #240244;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 0.5em 1em;
  z-index: 100000000;
  min-width: 150px;
}

.dropdown-item {
  color: #f0f0f0;
  font-family: "Poppins", sans-serif;
  padding: 0.5em 0;
  text-decoration: none;
  display: flex;
  align-items: center; /* Ensure icon and text are aligned */
  transition: color 0.3s;
}

.dropdown-item:hover {
  color: #ff7e5f;
  background: #240244;
}

.dropdown-item i {
  margin-right: 0.5em;
}

.navbar-nav .router-link-active {
  color: #ff7e5f;
}

/* For smaller screens */
@media (max-width: 991px) {
  .dropdown-menu {
    right: -10px;
  }
  /* Hide the welcome message on small screens */
  .logged-in-info.mx-4.text-light.fw-bold {
    display: none;
  }
}

/* Adjust dropdown position if it goes off-screen */
@media (max-width: 400px) {
  .dropdown-menu {
    right: -50px;
  }
}

/* Styles for auth buttons */
.auth-buttons {
  display: flex;
  align-items: center;
  flex-wrap: nowrap; /* Prevent wrapping */
}

.auth-buttons .btn {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  margin-right: 0.5em;
  display: flex;
  align-items: center; /* Ensure icon and text are aligned */
  white-space: nowrap; /* Prevent text from wrapping */
}

.auth-buttons .btn:last-child {
  margin-right: 0;
}

.auth-buttons .btn i {
  margin-right: 0.5em;
}

/* Ensure icons and text are on the same line */
.btn i,
.dropdown-item i {
  display: inline-block;
  vertical-align: middle;
}

.btn span {
  display: inline-block;
  vertical-align: middle;
}
</style>
