<template>
  <div id="app" class="container-fluid p-4 px-sm-0">
    <!-- Bootstrap Row -->
    <div class="row no-margin-on-small align-items-start">
      
      <!-- Filter Section -->
      <div class="filter-section col-12 col-lg-3 mb-4 mb-lg-0">
        <!-- User Section -->
        <div class="user-section col-12 col-lg-12 mb-4 mb-lg-0">
          <div v-if="loggedInUser" class="logged-in-info mb-3">
            <p class="text-light">Welcome, {{ loggedInUser }}!</p>
          </div>
          <div v-else class="login-button mb-3">
            <button class="btn btn-primary w-100" @click="handleLogin">Log In</button>
          </div>
        </div>
        <button class="btn btn-secondary d-lg-none w-100 mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#filterCollapse" aria-expanded="false" aria-controls="filterCollapse">
          Toggle Filters
        </button>
        <div class="collapse d-lg-block" id="filterCollapse">
          <h3>Filters</h3>
          <h5>Genres</h5>
          <div class="genre-pills-container mb-3">
            <div v-for="genre in genres" :key="genre" class="genre-pill" :class="{ 'selected': selectedGenres.includes(genre) }" @click="toggleGenre(genre)">
              {{ genre }}
            </div>
            <div v-for="genre in additionalGenres" :key="'additional-' + genre" class="genre-pill" :class="{ 'selected': selectedGenres.includes(genre) }" @click="toggleGenre(genre)">
              {{ genre }}
            </div>
          </div>

          <h5>Other Genres</h5>
          <select class="styled-select mb-3" @change="addLessCommonGenre($event)">
            <option value="" disabled selected>Select other genres...</option>
            <option v-for="genre in lessCommonGenres" :key="genre" :value="genre" v-if="!selectedGenres.includes(genre)">{{ genre }}</option>
          </select>

          <h5>Price Range</h5>
          <div class="d-flex justify-content-between mb-2">
            <span>${{ minPrice }}</span>
            <span>${{ maxPrice }}</span>
          </div>
          <input type="range" v-model="priceRange" :min="minPrice" :max="maxPrice" class="styled-range mb-3" @input="updatePriceRange" />
          <p>Up to: ${{ priceRange }}</p>

          <button class="btn btn-danger w-100 mt-3" @click="clearFilters">Clear All Filters</button>
        </div>
      </div>
      
      <!-- Cards Section -->
      <div class="cardsSection col-12 col-lg-9">
        <input type="text" class="search-bar mb-4" placeholder="Search by name or genre..." v-model="searchQuery" @input="resetPage" />
        <div class="d-flex flex-wrap gap-3 align-items-stretch">
          <div v-for="band in paginatedBands" :key="band.id + '-' + filterTrigger" class="card-container">
            <div class="card h-100">
              <img :src="band.thumbnail" alt="" class="card-img-top" />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ band.name }}</h5>
                <p class="card-text">
                  Genre: {{ band.genres }} <br />
                  Price: ${{ band.price }}
                </p>
                <div class="mt-auto">
                  <a href="#" class="btn btn-primary w-100">More Info</a>
                </div>
              </div>
            </div>
          </div>
          <div v-if="filteredBands.length === 0" class="col-12 text-center text-light mt-5">No results found.</div>
        </div>

        <!-- Pagination Controls -->
        <div class="pagination-controls d-flex justify-content-center mt-4">
          <button class="btn btn-secondary me-2" :disabled="currentPage === 1" @click="prevPage">Previous Page</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="btn btn-secondary ms-2" :disabled="currentPage === totalPages" @click="nextPage">Next Page</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from './Nav.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    Nav,
  },
  data() {
    return {
      loggedInUser: null,
      bands: [],
      searchQuery: '',
      genres: ['Pop', 'Country', 'Ambient', 'Jazz', 'Rock', 'Hip Hop', 'Metal', 'Electronic', 'Blues', 'Reggae'],
      lessCommonGenres: ['Folk', 'Indie', 'Ska', 'Punk', 'Funk', 'Latin', 'Gospel', 'Grunge', 'Soul'],
      selectedGenres: [],
      additionalGenres: [],
      priceRange: 500,
      minPrice: 0,
      maxPrice: 500,
      currentPage: 1,
      itemsPerPage: 15,
      filterTrigger: 0,  // New property to trigger animation
    };
  },
  computed: {
    filteredBands() {
      return this.bands.filter(band => {
        const matchesSearch = !this.searchQuery || band.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          band.genres.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesGenre = this.selectedGenres.length === 0 || this.selectedGenres.includes(band.genres) || this.additionalGenres.includes(band.genres);
        const matchesPrice = band.price <= this.priceRange;
        return matchesSearch && matchesGenre && matchesPrice;
      });
    },
    paginatedBands() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredBands.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredBands.length / this.itemsPerPage);
    }
  },
  methods: {
    updatePriceRange() {
      this.resetPage();
      this.filterTrigger++;  // Increment to trigger animation whenever price changes
    },
    resetPage() {
      this.currentPage = 1;
      this.filterTrigger++;  // Increment to trigger animation
    },
    toggleGenre(genre) {
      if (this.selectedGenres.includes(genre)) {
        this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
      } else {
        this.selectedGenres.push(genre);
      }
      this.resetPage();
      this.filterTrigger++;  // Increment to trigger animation
    },
    addLessCommonGenre(event) {
      const genre = event.target.value;
      if (this.selectedGenres.includes(genre)) {
        event.target.selectedIndex = 0;
        return;
      }
      if (!this.additionalGenres.includes(genre)) {
        this.additionalGenres.push(genre);
      }
      this.selectedGenres.push(genre);
      this.lessCommonGenres = this.lessCommonGenres.filter(g => g !== genre);
      event.target.selectedIndex = 0;
      this.resetPage();
      this.filterTrigger++;  // Increment to trigger animation
    },
    clearFilters() {
      this.selectedGenres = [];
      this.additionalGenres = [];
      this.priceRange = this.maxPrice;
      this.searchQuery = '';
      this.resetPage();
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    handleLogin() {
      // Placeholder for login functionality
      console.log('Login button clicked');
      window.location.href = '';
    }
  },
  mounted() {
    axios.get('/MOCK_DATA.json')
      .then(response => {
        this.bands = response.data;
        this.updatePriceRange();

        // Add a small delay to each card for staggered animations
        this.$nextTick(() => {
          const cardContainers = document.querySelectorAll('.card-container');
          cardContainers.forEach((card, index) => {
            card.style.setProperty('--animation-delay', `${index * 0.1}s`);
          });
        });
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #1a1a2e;
  color: #e0e0e0;
}

.cardsSection {
  background: linear-gradient(to bottom, rgba(34, 49, 63, 0.7), rgba(45, 52, 54, 0.7));
  min-height: 100vh;
  padding: 20px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.search-bar {
  padding: 15px;
  border-radius: 50px;
  border: none;
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.3);
  font-weight: bold;
  width: 100%;
}

.search-bar::placeholder {
  color: #adadad;
}

.styled-select {
  padding: 10px;
  border-radius: 16px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.3);
  font-weight: bold;
  width: 100%;
  transition: background-color 0.3s;
}

.styled-select option {
  background: #2a2a40;
  color: #ffffff;
}

.styled-range {
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: linear-gradient(135deg, #6a0572, #a6038b);
  outline: none;
  opacity: 0.9;
  transition: opacity 0.2s;
}

.styled-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff7e5f;
  cursor: pointer;
}

.styled-range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff7e5f;
  cursor: pointer;
}

.card-container {
  flex: 1 1 calc(20% - 1rem);
  max-width: calc(20% - 1rem);
  padding: 10px;
  display: flex;
  align-items: stretch;
  opacity: 0; /* Set initial opacity to 0 for the animation effect */
  animation: fadeInUp 0.2s ease-in-out forwards; /* Use forwards to keep final state */
  animation-delay: var(--animation-delay);
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1400px) {
  .card-container {
    flex: 1 1 calc(25% - 1rem);
    max-width: calc(25% - 1rem);
  }
}

@media (max-width: 1200px) {
  .card-container {
    flex: 1 1 calc(33.33% - 1rem);
    max-width: calc(33.33% - 1rem);
  }
}

@media (max-width: 992px) {
  .card-container {
    flex: 1 1 calc(50% - 1rem);
    max-width: calc(50% - 1rem);
  }
}

@media (max-width: 600px) {
  .card-container {
    flex: 1 1 calc(100% - 1rem);
    max-width: calc(100% - 1rem);
  }
  .filter-section {
    padding: 0;
  }
  #app {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .filter-section {
    padding: 0;
  }
  .no-margin-on-small {
    margin: 0 !important;
  }
}

.card {
  background: rgba(31, 38, 135, 0.37);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: transform 0.3s;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card:hover {
  transform: translateY(-10px);
}

.card-title {
  color: #f39c12;
}

.card-text {
  color: #ffffff;
}

.filter-section {
  background: linear-gradient(to bottom, rgba(52, 73, 94, 0.7), rgba(44, 62, 80, 0.7));
  padding: 15px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #ffffff;
  min-height: auto;
}

.genre-pills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.genre-pill {
  padding: 10px 20px;
  background: linear-gradient(135deg, #6a0572, #a6038b);
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  color: #ffffff;
  transition: background 0.3s, color 0.3s;
  user-select: none;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
}

.genre-pill.selected {
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  color: #fff;
}

.pagination-controls {
  margin-top: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, #ff512f, #dd2476);
  border: none;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
}

.btn-secondary {
  background: linear-gradient(135deg, #36d1dc, #5b86e5);
  border: none;
  color: #fff;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #5b86e5, #36d1dc);
}

.btn-danger {
  background: linear-gradient(135deg, #e52d27, #b31217);
  border: none;
  color: #fff;
  transition: background-color 0.3s;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #ff6a6a, #ff4b4b);
}

.custom-gap {
  margin-left: 20px;
}

@media (max-width: 992px) {
  .custom-gap {
    margin-left: 0;
  }
}
</style>














