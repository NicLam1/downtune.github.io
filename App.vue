<!-- src/App.vue -->
<template>
  <Nav v-if="!hideNavbar"></Nav>
  <router-view v-slot="{ Component }">
    <transition
      enter-active-class="animate__animated animate__fadeIn"
      mode="out-in"
    >
      <component :is="Component" :key="$route.path"></component>
    </transition>
  </router-view>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Nav from "./src/Nav.vue";
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  name: "App",
  components: {
    Nav,
  },
  setup() {
    const route = useRoute();

    // Compute whether the navbar should be hidden based on the route
    const hideNavbar = computed(() => {
      return (
        route.path === "/login/user" ||
        route.path === "/login/band" ||
        route.path === "/register/user" ||
        route.path === "/register/band" ||
        route.path === "/forgotPassword" 
      );
    });

    return {
      hideNavbar,
    };
  },
};
</script>

<style>
/* Global styles */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");
.slide-enter-active,
.slide-leave-active {
  transition: opacity 1s, transform 1s;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>
