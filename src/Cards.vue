<template>
  <div id="app" class="container-fluid px-sm-0 px-lg-4 mt-4">
    <!-- Bootstrap Row -->
    <div class="row no-margin-on-small align-items-stretch flex-lg-nowrap gx-lg-3">
      
      <!-- Filter Section -->
      <div class="filter-section col-12 col-lg-3 mb-4 mb-lg-0">
        <!-- User Section -->
        
        <button class="btn btn-secondary d-lg-none w-100 mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#filterCollapse" aria-expanded="false" aria-controls="filterCollapse">
          <i class="fas fa-sliders-h"></i> Toggle Filters
        </button>
        <div class="collapse d-lg-block" id="filterCollapse">
          <h3 class="filter-heading"><i class="fas fa-filter"></i> Filters</h3>
          <h5><i class="fas fa-music"></i> Genres</h5>
          <div class="genre-pills-container mb-3">
            <div v-for="genre in genres" :key="genre" class="genre-pill" :class="{ 'selected': selectedGenres.includes(genre) }" @click="toggleGenre(genre)">
              <i :class="genreIcons[genre]" class="genre-icon"></i> {{ genre }}
            </div>
            <div v-for="genre in additionalGenres" :key="'additional-' + genre" class="genre-pill" :class="{ 'selected': selectedGenres.includes(genre) }" @click="toggleGenre(genre)">
              <i :class="genreIcons[genre]" class="genre-icon"></i> {{ genre }}
            </div>
          </div>

          <h5><i class="fas fa-plus-circle"></i> Other Genres</h5>
          <select class="styled-select mb-3" @change="addLessCommonGenre($event)">
            <option value="" disabled selected>Select other genres...</option>
            <option v-for="genre in lessCommonGenres" :key="genre" :value="genre" v-if="!selectedGenres.includes(genre)">
              {{ genre }}
            </option>
          </select>

          <h5><i class="fas fa-dollar-sign"></i> Price Range</h5>
          <div class="d-flex justify-content-between mb-2">
            <span>${{ minPrice }}</span>
            <span>${{ maxPrice }}</span>
          </div>
          <input type="range" v-model="priceRange" :min="minPrice" :max="maxPrice" class="styled-range mb-3" @input="updatePriceRange" />
          <p>Up to: ${{ priceRange }}</p>

          <button class="btn btn-danger w-100 mt-3" @click="clearFilters">
            <i class="fas fa-times-circle"></i> Clear All Filters
          </button>
        </div>
      </div>
      
      <!-- Cards Section -->
      <div class="cardsSection col-12 col-lg-9">
        <input type="text" class="search-bar mb-4" placeholder="Search by name or genre..." v-model="searchQuery" @input="resetPage" />
        <div class="d-flex flex-wrap gap-3 align-items-stretch">
          <div v-for="band in paginatedBands" :key="band.id + '-' + filterTrigger" class="card-container">
            <div class="card h-100">
              <div class="card-image-container">
                <img :src="band.thumbnail" alt="" class="card-img-top" />
                <div class="overlay">
                  <i class="fas fa-play-circle"></i>
                </div>
              </div>
              <div class="card-body d-flex flex-column text-left">
                <h5 class="card-title fw-bold">{{ band.name }}</h5>
                <p class="card-text">
                  Genre: {{ band.genres }} <br />
                  Rate: ${{ band.price }}/hr
                </p>
                <div class="mt-auto">
                  <a href="#" class="btn btn-primary w-100">
                    <i class="fas fa-info-circle"></i> More Info
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div v-if="filteredBands.length === 0" class="col-12 text-center text-light mt-5">No results found.</div>
        </div>

        <!-- Pagination Controls -->
        <div class="pagination-controls d-flex justify-content-center mt-4">
          <button class="btn btn-secondary me-2" :disabled="currentPage === 1" @click="prevPage">
            <i class="fas fa-chevron-left"></i> Previous Page
          </button>
          <span class="text-light">Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="btn btn-secondary ms-2" :disabled="currentPage === totalPages" @click="nextPage">
            Next Page <i class="fas fa-chevron-right"></i>
          </button>
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
      filterTrigger: 0,
      genreIcons: {
        'Pop': 'fas fa-music',
        'Country': 'fas fa-guitar',
        'Ambient': 'fas fa-leaf',
        'Jazz': 'fas fa-music',
        'Rock': 'fas fa-guitar',
        'Hip Hop': 'fas fa-microphone-alt',
        'Metal': 'fas fa-skull',
        'Electronic': 'fas fa-headphones',
        'Blues': 'fas fa-music',
        'Reggae': 'fas fa-tree',
        'Folk': 'fas fa-tree',
        'Indie': 'fas fa-star',
        'Ska': 'fas fa-music',
        'Punk': 'fas fa-bolt',
        'Funk': 'fas fa-guitar',
        'Latin': 'fas fa-music',
        'Gospel': 'fas fa-church',
        'Grunge': 'fas fa-smog',
        'Soul': 'fas fa-heart',
      },
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
      this.filterTrigger++;
    },
    resetPage() {
      this.currentPage = 1;
      this.filterTrigger++;
    },
    toggleGenre(genre) {
      if (this.selectedGenres.includes(genre)) {
        this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
        if (this.additionalGenres.includes(genre)) {
          this.additionalGenres = this.additionalGenres.filter(g => g !== genre);
          this.lessCommonGenres.push(genre);
        }
      } else {
        this.selectedGenres.push(genre);
      }
      this.resetPage();
      this.filterTrigger++;
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
      this.filterTrigger++;
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

<style scoped>


#app {
  /* Remove side padding on small screens */
  padding-left: 0;
  padding-right: 0;
  background: linear-gradient(135deg, rgba(14, 0, 19, 0.85), rgba(17, 0, 36, 0.9));
}

.cardsSection {
  background: linear-gradient(135deg, rgba(32, 1, 43, 0.85), rgba(10, 0, 20, 0.9));
  padding: 20px;
  border-radius: 0px 16px 16px 0px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(102, 0, 204, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-grow: 1;
  min-height: 130vh;
}

.search-bar {
  padding: 15px;
  border-radius: 50px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  backdrop-filter: blur(10px);
  /* box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.3); */
  box-shadow: 0 0 10px 5px rgba(185, 72, 255, 0.521);
  font-weight: bold;
  width: 100%;
} 

.search-bar::placeholder {
  color: #b8a1c9;
}

.styled-select {
  padding: 10px;
  border-radius: 16px;
  border: none;
  background: rgba(102, 0, 153, 0.3);
  color: #ffffff;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.3);
  font-weight: bold;
  width: 100%;
  transition: background-color 0.3s;
}

.styled-select option {
  background: #3d004d;
  color: #ffffff;
}

.styled-range {
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: linear-gradient(135deg, #b000e8, #ff00ff);
  outline: none;
  opacity: 0.9;
  transition: opacity 0.2s;
  cursor: pointer;
}

.styled-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff6bd6;
  cursor: pointer;
}

.styled-range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff6bd6;
  cursor: pointer;
}

.card-container {
  flex: 1 1 calc(20% - 1rem);
  max-width: calc(20% - 1rem);
  padding: 10px;
  display: flex;
  align-items: stretch;
  opacity: 0;
  animation: fadeInUp 0.2s ease-in-out forwards;
  animation-delay: var(--animation-delay);
  cursor: pointer;
  
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
  background: rgba(58, 0, 77, 0.7);
  box-shadow: 0 8px 32px 0 rgba(76, 0, 153, 0.5);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: transform 0.3s;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-img-top {
  object-fit: cover;
  aspect-ratio: 1/1;
}

.card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.6);
}

.card-title {
  color: #ff00ff;
}

.card-text {
  color: #e6e1e5;
}

.filter-section {
  background: linear-gradient(135deg, rgba(31, 0, 61, 0.85), rgba(101, 0, 163, 0.85));
  padding: 15px;
  border-radius: 16px 0px 0px 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(102, 0, 204, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  min-height: auto;
  display: flex;
  flex-direction: column;
}

.genre-pills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.genre-pill {
  padding: 10px 20px;
  background: linear-gradient(135deg, #6f00e8, #c603ff);
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  color: #ffffff;
  transition: background 0.3s, color 0.3s;
  user-select: none;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
}

.genre-pill.selected {
  background: linear-gradient(135deg, #e600e8, #ff66ff);
  color: #fff;
}

.genre-icon {
  margin-right: 8px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(26, 0, 38, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #fff;
  font-size: 48px;
}

.card-image-container {
  position: relative;
}

.card-image-container:hover .overlay {
  opacity: 1;
}

.pagination-controls {
  margin-top: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, #d900ff, #7500e8);
  border: none;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #ff66ff, #c603ff);
}

.btn-secondary {
  background: linear-gradient(135deg, #7100e0, #ac00e8);
  border: none;
  color: #fff;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #b66dff, #d66bff);
}

.btn-danger {
  background: linear-gradient(135deg, #a000e8, #7500e8);
  border: none;
  color: #fff;
  transition: background-color 0.3s;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #d666ff, #e600e8);
}

.filter-heading {
  display: flex;
  align-items: center;
}

.filter-heading i {
  margin-right: 8px;
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
