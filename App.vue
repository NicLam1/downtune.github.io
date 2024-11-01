<!-- src/App.vue -->
<template>
    <Nav v-if="!hideNavbar"></Nav>
    <router-view></router-view>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Nav from './src/Nav.vue';
export default {
    name: 'App',
    components: {
        Nav
    },
    setup() {
        const route = useRoute();

        // Compute whether the navbar should be hidden based on the route
        const hideNavbar = computed(() => {
            return route.path === '/login' || route.path === '/register';
        });

        return {
            hideNavbar
        };
    }
};
</script>