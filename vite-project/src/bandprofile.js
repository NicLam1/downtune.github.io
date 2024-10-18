import { createApp } from 'vue';

// import App from './App.vue'; // Assuming App.vue is the main component
import BandProfile from './BandProfile.vue'; // Importing the BandProfile component

// Mounting App component
// createApp(App).mount('#app');

// Mounting BandProfile component to its specific div in the HTML file
createApp(BandProfile).mount('#band-profile');