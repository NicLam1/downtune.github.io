<template>
  <div id="app" class="container-fluid px-sm-3 px-lg-4 mt-4">
    <!-- Bootstrap Row -->
    <div
      class="row no-margin-on-small align-items-stretch flex-lg-nowrap gx-lg-3"
    >
      <!-- Filter Section -->
      <div class="filter-section col-12 col-lg-3 mb-4 mb-lg-0">
        <!-- Toggle Filters Button for Small Screens -->
        <button
          class="btn btn-secondary d-lg-none w-100 mb-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#filterCollapse"
          aria-expanded="false"
          aria-controls="filterCollapse"
        >
          <i class="fas fa-sliders-h"></i> Toggle Filters
        </button>
        <div class="collapse d-lg-block" id="filterCollapse">
          <h3 class="filter-heading"><i class="fas fa-filter"></i> Filters</h3>

          <!-- Genres Filter -->
          <h5><i class="fas fa-music"></i> Genres</h5>
          <div class="genre-pills-container mb-3">
            <div
              v-for="genre in genres"
              :key="genre"
              class="genre-pill"
              :class="{
                selected: selectedGenres.includes(genre),
                glow: newlyAddedGenres.includes(genre),
              }"
              @click="toggleGenre(genre)"
            >
              <i :class="genreIcons[genre]" class="genre-icon"></i> {{ genre }}
            </div>
          </div>

          <!-- Other Genres Dropdown -->
          <h5><i class="fas fa-plus-circle"></i> Other Genres</h5>
          <select
            class="styled-select mb-3"
            @change="addLessCommonGenre($event)"
          >
            <option value="" disabled selected>Select other genres...</option>
            <option
              v-for="genre in lessCommonGenres"
              :key="genre"
              :value="genre"
              v-if="!genres.includes(genre)"
            >
              {{ genre }}
            </option>
          </select>

          <!-- Price Range Display -->
          <h5><i class="fas fa-dollar-sign"></i> Price Range</h5>
          <div class="d-flex justify-content-between mb-2 align-items-center">
            <span>Min: $</span>
            <input
              type="number"
              v-model="priceRange.min"
              :min="minPrice"
              :max="priceRange.max"
              class="form-control me-2 ms-2 w-auto"
              @input="adjustMinPriceInput"
            />

            <span>Max: $</span>
            <input
              type="number"
              v-model="priceRange.max"
              :min="priceRange.min"
              :max="maxPrice"
              class="form-control me-2 ms-2 w-auto"
              @input="adjustMaxPriceInput"
            />
          </div>

          <!-- Minimum Price Slider -->
          <div class="d-flex align-items-center mb-3">
            <span class="me-2">Min</span>
            <input
              id="minPriceSlider"
              type="range"
              v-model="priceRange.min"
              :min="minPrice"
              :max="priceRange.max"
              class="styled-range"
              @input="adjustMinPrice"
            />
          </div>

          <!-- Maximum Price Slider -->
          <div class="d-flex align-items-center mb-3">
            <span class="me-2">Max</span>
            <input
              id="maxPriceSlider"
              type="range"
              v-model="priceRange.max"
              :min="priceRange.min"
              :max="maxPrice"
              class="styled-range"
              @input="adjustMaxPrice"
            />
          </div>

          <!-- Clear Filters Button -->
          <button class="btn btn-danger w-100 mt-3" @click="clearFilters">
            <i class="fas fa-times-circle"></i> Clear All Filters
          </button>
        </div>
      </div>

      <!-- Cards Section -->
      <div class="cardsSection col-12 col-lg-9">
        <input
          type="text"
          class="search-bar mb-4"
          placeholder="Search by name or genre..."
          v-model="searchQuery"
          @input="resetPage"
        />
        <div class="d-flex flex-wrap gap-3 align-items-stretch">
          <div
            v-for="band in paginatedBands"
            :key="band.id + '-' + filterTrigger"
            class="card-container"
          >
            <div class="card-wrapper">
              <router-link
                :to="{ name: 'BandProfile', params: { id: band.id } }"
                class="card-link"
              >
                <div class="card h-100 d-flex flex-column">
                  <div class="card-image-container">
                    <img
                      :src="band.thumbnail"
                      :alt="band.name"
                      class="card-img-top"
                      loading="lazy"
                    />
                    <div class="overlay">
                      <i class="fas fa-info-circle"></i>
                    </div>
                  </div>
                  <div
                    class="card-body d-flex flex-column text-left flex-grow-1"
                  >
                    <h4 class="card-title fw-bold">{{ band.name }}</h4>
                    <p class="card-text">
                      <span
                        v-for="genre in band.genres"
                        :key="genre"
                        class="badge me-1 genre-badge"
                      >
                        {{ genre }}
                      </span>
                    </p>
                    <!-- Spacer to push the price to the bottom -->
                    <div class="flex-grow-1"></div>
                    <p class="card-text price-text">
                      <strong>Price:</strong> ${{ band.price }}/hr
                    </p>
                  </div>
                </div>
              </router-link>
              <!-- Add to Favorites Button -->
              <div v-if="isLoggedIn">
                <button
                  class="btn-favorite"
                  @click.stop="toggleFavorite(band)"
                  :class="{ favorited: isFavorited(band.id) }"
                  :title="
                    isFavorited(band.id)
                      ? 'Remove from Favorites'
                      : 'Add to Favorites'
                  "
                >
                  <i
                    :class="
                      isFavorited(band.id) ? 'fas fa-heart' : 'far fa-heart'
                    "
                  ></i>
                </button>
              </div>
              <!-- Arrow Icon -->
              <!-- <div class="card-arrow mx-2">
                <i class="fas fa-arrow-right"></i>
              </div> -->
            </div>
          </div>
          <div
            v-if="filteredBands.length === 0"
            class="col-12 text-center text-light mt-5"
          >
            No results found.
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="pagination-controls d-flex justify-content-center mt-4">
          <button
            class="btn btn-secondary me-2"
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            <i class="fas fa-chevron-left"></i> Previous Page
          </button>
          <span class="text-light mx-3"
            >Page {{ currentPage }} of {{ totalPages }}</span
          >
          <button
            class="btn btn-secondary ms-2"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            Next Page <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { inject } from "vue";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  props: {
    userGenres: {
      type: Array,
      default: () => [],
    },
    userPrefMinPrice: {
      type: Number,
      // default: 0 // Set a default value for minPrice if it's not passed
    },
    userPrefMaxPrice: {
      type: Number,
      // default: 100 // Set a default value for maxPrice if it's not passed
    },
  },
  name: "Cards",
  setup() {
    const isLoggedIn = inject("isLoggedIn");

    return { isLoggedIn };
  },
  data() {
    return {
      bands: [],
      searchQuery: "",
      genres: [
        "Pop",
        "Country",
        "Ambient",
        "Jazz",
        "Rock",
        "Hip Hop",
        "Metal",
        "Electronic",
        "Blues",
        "Reggae",
      ],
      lessCommonGenres: [
        "Folk",
        "Indie",
        "Ska",
        "Punk",
        "Funk",
        "Latin",
        "Gospel",
        "Grunge",
        "Soul",
      ],
      selectedGenres: [],
      minPrice: 0,
      maxPrice: 1000,
      priceRange: {
        min: 0,
        max: 1000,
        userPrefMinPrice: null, // User's preferred min price
        userPrefMaxPrice: null, // User's preferred max price
        priceRangeMinUpdated: false, // Flag to track if the price range has been updated
        priceRangeMaxUpdated: false, // Flag to track if the price range has been updated
      },
      currentPage: 1,
      itemsPerPage: 12,
      filterTrigger: 0,
      genreIcons: {
        Pop: "fas fa-music",
        Country: "fas fa-guitar",
        Ambient: "fas fa-leaf",
        Jazz: "fas fa-music",
        Rock: "fas fa-guitar",
        "Hip Hop": "fas fa-microphone-alt",
        Metal: "fas fa-skull",
        Electronic: "fas fa-headphones",
        Blues: "fas fa-music",
        Reggae: "fas fa-tree",
        Folk: "fas fa-tree",
        Indie: "fas fa-star",
        Ska: "fas fa-music",
        Punk: "fas fa-bolt",
        Funk: "fas fa-guitar",
        Latin: "fas fa-music",
        Gospel: "fas fa-church",
        Grunge: "fas fa-smog",
        Soul: "fas fa-heart",
      },
      favorites: [], // Initialize favorites
      newlyAddedGenres: [], // For the glow effect
    };
  },
  computed: {
    filteredBands() {
      return this.bands.filter((band) => {
        // Search Filter
        const matchesSearch =
          !this.searchQuery ||
          band.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          band.genres.some((genre) =>
            genre.toLowerCase().includes(this.searchQuery.toLowerCase())
          );

        // Genre Filter
        const matchesGenre =
          this.selectedGenres.length === 0 ||
          band.genres.some((genre) => this.selectedGenres.includes(genre));

        // Price Filter
        const matchesPrice =
          band.price >= this.priceRange.min &&
          band.price <= this.priceRange.max;

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
    },
  },
  methods: {
    adjustMinPrice() {
      if (this.priceRange.min >= this.priceRange.max) {
        this.priceRange.min = this.priceRange.max - 1;
      }
      this.resetPage();
      this.filterTrigger++;
    },
    adjustMaxPrice() {
      if (this.priceRange.max <= this.priceRange.min) {
        this.priceRange.max = this.priceRange.min + 1;
      }
      this.resetPage();
      this.filterTrigger++;
    },
    adjustMinPriceInput() {
      // Handle min price input field change
      if (this.priceRange.min >= this.priceRange.max) {
        this.priceRange.min = this.priceRange.max - 1;
      }
      this.resetPage();
      this.filterTrigger++;
    },
    adjustMaxPriceInput() {
      // Handle max price input field change
      if (this.priceRange.max <= this.priceRange.min) {
        this.priceRange.max = this.priceRange.min + 1;
      }
      this.resetPage();
      this.filterTrigger++;
    },
    resetPage() {
      this.currentPage = 1;
      this.filterTrigger++;
    },
    toggleGenre(genre) {
      if (this.selectedGenres.includes(genre)) {
        this.selectedGenres = this.selectedGenres.filter((g) => g !== genre);
      } else {
        this.selectedGenres.push(genre);
      }
      this.resetPage();
      this.filterTrigger++;
    },
    addLessCommonGenre(event) {
      const genre = event.target.value;
      if (genre && !this.genres.includes(genre)) {
        this.genres.push(genre); // Add to genres list to display as a pill
      }
      if (genre && !this.selectedGenres.includes(genre)) {
        this.selectedGenres.push(genre); // Mark as selected
        this.newlyAddedGenres.push(genre); // Add to newlyAddedGenres for glow effect
        // Remove the glow class after a delay
        setTimeout(() => {
          this.newlyAddedGenres = this.newlyAddedGenres.filter(
            (g) => g !== genre
          );
        }, 1000); // Duration of the glow effect in milliseconds
      }
      event.target.selectedIndex = 0; // Reset dropdown selection
      this.resetPage();
      this.filterTrigger++;
    },
    clearFilters() {
      this.selectedGenres = [];
      this.priceRange = { min: this.minPrice, max: this.maxPrice }; // Reset both min and max
      this.searchQuery = "";
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
    async toggleFavorite(band) {
      if (this.isFavorited(band.id)) {
        this.favorites = this.favorites.filter((fav) => fav.id !== band.id);
      } else {
        this.favorites.push(band);
      }
      await this.saveFavorites();
    },
    isFavorited(bandId) {
      return this.favorites.some((fav) => fav.id === bandId);
    },
    async loadFavorites() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDoc = doc(db, "userPreferences", user.uid);
        try {
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            const favoriteIds = docSnap.data().favorites || [];
            this.favorites = this.bands.filter((band) =>
              favoriteIds.includes(band.id)
            );
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error loading favorites from Firestore:", error);
        }
      } else {
        console.error("User is not authenticated");
      }
    },
    async saveFavorites() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDoc = doc(db, "userPreferences", user.uid);
        const bandIds = this.favorites.map((fav) => fav.id);
        try {
          await setDoc(userDoc, { favorites: bandIds }, { merge: true });
          console.log("Favorites saved to Firestore");
        } catch (error) {
          console.error("Error saving favorites to Firestore:", error);
        }
      } else {
        console.error("User is not authenticated");
      }
    },
  },

  async mounted() {
    try {
      const response = await axios.get("/MOCK_DATA.json");
      this.bands = response.data;
      // Determine min and max price from data
      const prices = this.bands.map((band) => band.price);
      this.minPrice = Math.min(...prices);
      this.maxPrice = Math.max(...prices);
      this.priceRange = { min: this.minPrice, max: this.maxPrice };
      await this.loadFavorites(); // Load favorites after bands are loaded
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    // Append userGenres to selectedGenres when the component is mounted
    if (this.userGenres && this.userGenres.length) {
      this.selectedGenres = [...this.selectedGenres, ...this.userGenres];
    }
  },

  watch: {
    userGenres(newGenres) {
      if (newGenres && newGenres.length) {
        // Ensure that new genres are added only once (avoid duplicates)
        this.selectedGenres = [
          ...new Set([...this.selectedGenres, ...newGenres]),
        ];
      }
    },
    userPrefMinPrice(newMinPrice) {
      if (newMinPrice !== null && !this.priceRangeMinUpdated) {
        this.priceRange.min = newMinPrice; // Update the price range
        this.priceRangeMinUpdated = true;
        console.log(this.priceRange);
        console.log("User price min range updated to:", newMinPrice);
      }
    },
    userPrefMaxPrice(newMaxPrice) {
      if (newMaxPrice !== null && !this.priceRangeMaxUpdated) {
        console.log("User price min range updated to:", newMaxPrice);
        this.priceRange.max = newMaxPrice; // Update the price range
        this.priceRangeMaxUpdated = true;
        console.log(this.priceRange);
        console.log("User price min range updated to:", newMaxPrice);
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

body {
  font-family: "Poppins", sans-serif;
  background: linear-gradient(
    135deg,
    rgba(14, 0, 19, 0.85),
    rgba(17, 0, 36, 0.9)
  );
}

#app {
  padding-left: 0;
  padding-right: 0;
  background: none;
}

.cardsSection {
  background: linear-gradient(
    135deg,
    rgba(32, 1, 43, 0.85),
    rgba(10, 0, 20, 0.9)
  );
  padding: 20px;
  border-radius: 0px 16px 16px 0px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(102, 0, 204, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-grow: 1;
  min-height: 100vh;
  color: #ffffff;
}

@media (width<992px) {
  .cardsSection {
    border-radius: 16px;
  }
}

.search-bar {
  padding: 15px;
  border-radius: 4px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px 5px rgba(185, 72, 255, 0.521);
  font-weight: bold;
  width: 100%;
}

.card-container {
  flex: 1 1 calc(25% - 1rem);
  max-width: calc(25% - 1rem);
  padding: 10px;
  display: flex;
  align-items: stretch;
  cursor: pointer;
}

.card-link {
  text-decoration: none;
}

.card-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.btn-favorite {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(100, 1, 133, 0.372);
  border: none;
  border-radius: 25px;
  padding: 10px;
  cursor: pointer;
  color: #ff4081;
  transition: background 0.3s, color 0.3s;
}

.btn-favorite:hover {
  background: rgba(255, 255, 255, 0.4);
}

.btn-favorite.favorited {
  color: #e91e63;
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
}

.card {
  background: rgba(58, 0, 77, 0.7);
  box-shadow: 0 8px 32px 0 rgba(76, 0, 153, 0.5);
  border-radius: 4px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
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
  color: #ff66ff;
}

.card-text {
  color: #e6e1e5;
}

.price-text {
  font-size: 1.1em;
  color: #ffffff;
}

.filter-section {
  background: linear-gradient(
    135deg,
    rgba(31, 0, 61, 0.85),
    rgba(101, 0, 163, 0.85)
  );
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

@media (width<992px) {
  .filter-section {
    background: linear-gradient(
      135deg,
      rgba(31, 0, 61, 0.85),
      rgba(101, 0, 163, 0.85)
    );
    padding: 15px;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px 0 rgba(102, 0, 204, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffffff;
    min-height: auto;
    display: flex;
    flex-direction: column;
  }
}

.genre-pills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.genre-pill {
  padding: 7px 20px;
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

.genre-pill.glow {
  animation: glow-animation 1s forwards;
}

@keyframes glow-animation {
  0% {
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
  }
  100% {
    box-shadow: none;
  }
}

.genre-icon {
  margin-right: 8px;
}

.genre-badge {
  background-color: #7100e0;
  border-radius: 50px;
  padding: 5px 10px 5px 10px;
  margin-bottom: 5px;
}

.styled-select {
  padding: 10px;
  border-radius: 4px;
  border: none;
  background: rgb(54, 0, 75);
  color: #ffffff;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px 5px rgba(185, 72, 255, 0.521);
  font-weight: bold;
  width: 100%;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20fill%3D%27%23ffffff%27%20height%3D%2710%27%20viewBox%3D%270%200%2024%2024%27%20width%3D%2710%27%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%3E%3Cpath%20d%3D%27M7%2010l5%205%205-5H7z%27/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 10px 10px;
}

.styled-select:hover {
  cursor: pointer;
}

.styled-range {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.15);
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  box-shadow: 0 0 10px 5px rgba(185, 72, 255, 0.521);
}

.styled-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d900ff, #7500e8);
  cursor: pointer;
}

.styled-range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d900ff, #7500e8);
  cursor: pointer;
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

.card-arrow {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.3s;
}

.card:hover .card-arrow {
  transform: translateY(-10px) scale(1.2);
}

.pagination-controls {
  margin-top: 20px;
  align-items: center;
}

.btn-primary {
  background: linear-gradient(135deg, #d900ff, #7500e8);
  border: none;
  color: #fff;
  transition: background-color 0.3s, transform 0.3s;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #ff66ff, #c603ff);
  transform: scale(1.05);
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
  border-radius: 4px !important;
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
</style>
