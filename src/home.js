import { createApp } from 'vue'
import './style.css'
import App from './Cards.vue'

createApp(App).mount('#app')

// Import the functions you need from the SDKs you need

  document.addEventListener('DOMContentLoaded', function () {
    const genrePillsContainer = document.getElementById('genrePills');
    const genrePills = document.querySelectorAll('.genre-pill');
    const lessCommonGenresDropdown = document.getElementById('lessCommonGenres');

    // Handle clicks on genre pills
    genrePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const isSelected = pill.dataset.selected === "true";
        pill.dataset.selected = isSelected ? "false" : "true";
      });
    });

    // Handle selection of less common genres from dropdown and add as pills
    lessCommonGenresDropdown.addEventListener('change', () => {
      const selectedGenre = lessCommonGenresDropdown.value;

      // Check if the genre already exists as a pill
      if (![...genrePillsContainer.children].some(pill => pill.textContent === selectedGenre)) {
        const newPill = document.createElement('div');
        newPill.classList.add('genre-pill');
        newPill.dataset.selected = "true";
        newPill.textContent = selectedGenre;
        newPill.style.background = 'linear-gradient(to right, #ff7e5f, #feb47b)';
        newPill.style.color = 'white';

        // Add event listener for toggling the new pill
        newPill.addEventListener('click', () => {
          const isSelected = newPill.dataset.selected === "true";
          newPill.dataset.selected = isSelected ? "false" : "true";
          if (isSelected) {
            newPill.style.background = '#f0f0f0';
            newPill.style.color = '#333';
          } else {
            newPill.style.background = 'linear-gradient(to right, #ff7e5f, #feb47b)';
            newPill.style.color = 'white';
          }
        });

        // Append the new pill to the container
        genrePillsContainer.appendChild(newPill);
      }

      // Reset dropdown to default option
      lessCommonGenresDropdown.selectedIndex = 0;
    });
  });


import Nav from './Nav.vue';
createApp(Nav).mount('#nav-container');
import Botw from './Botw.vue';
createApp(Botw).mount('#botw')