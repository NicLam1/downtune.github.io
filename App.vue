<!-- src/App.vue -->
<template>
    <Nav></Nav>
    <router-view></router-view>
</template>

<script>
import Nav from './src/Nav.vue';
export default {
    name: 'App',
    components: {
        Nav
    },
};
</script>