<template>
    <div id="favorites-app" class="container-fluid px-sm-0 px-lg-4 mt-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-light">My Favorites</h2>
        <button class="btn btn-secondary" @click="goBack">
          <i class="fas fa-arrow-left"></i> Back
        </button>
      </div>
      
      <!-- Favorites Section -->
      <div class="cardsSection col-12">
        <div class="d-flex flex-wrap gap-3 align-items-stretch">
          <div 
            v-for="band in favorites" 
            :key="band.id + '-favorite'" 
            class="card-container"
          >
            <div class="card-wrapper">
              <router-link :to="{ name: 'BandProfile', params: { id: band.id } }" class="card-link">
                <div class="card h-100">
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
                  <div class="card-body d-flex flex-column text-left">
                    <h5 class="card-title fw-bold">{{ band.name }}</h5>
                    <p class="card-text">
                      <span
                        v-for="genre in band.genres"
                        :key="genre"
                        class="badge me-1 genre-badge"
                      >
                        {{ genre }}
                      </span>
                    </p>
                    <p class="card-text">
                      <strong>Price:</strong> ${{ band.price }}/hr
                    </p>
                  </div>
                </div>
              </router-link>
              <!-- Remove from Favorites Button -->
              <button 
                class="btn-favorite favorited"
                @click.stop="removeFavorite(band)"
                title="Remove from Favorites"
              >
                <i class="fas fa-heart"></i>
              </button>
            </div>
          </div>
          <div v-if="favorites.length === 0" class="col-12 text-center text-light mt-5">
            You have no favorites yet.
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Favorite',
    data() {
      return {
        favorites: [],
      };
    },
    methods: {
      loadFavorites() {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          this.favorites = JSON.parse(storedFavorites);
        }
      },
      removeFavorite(band) {
        this.favorites = this.favorites.filter(fav => fav.id !== band.id);
        this.saveFavorites();
      },
      saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
      },
      goBack() {
        this.$router.go(-1);
      },
    },
    mounted() {
      this.loadFavorites();
    },
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
  
  #favorites-app {
    background: linear-gradient(135deg, rgba(14, 0, 19, 0.85), rgba(17, 0, 36, 0.9));
    min-height: 100vh;
    padding-left: 0;
    padding-right: 0;
  }
  
  .cardsSection {
    background: linear-gradient(135deg, rgba(32, 1, 43, 0.85), rgba(10, 0, 20, 0.9));
    padding: 20px;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px 0 rgba(102, 0, 204, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    flex-grow: 1;
    min-height: auto;
  }
  
  .card-container {
    flex: 1 1 calc(20% - 1rem);
    max-width: calc(20% - 1rem);
    padding: 10px;
    display: flex;
    align-items: stretch;
    animation: fadeInUp 0.5s ease-in-out forwards;
    animation-delay: var(--animation-delay);
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
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
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
  }
  
  .card {
    background: rgba(58, 0, 77, 0.7);
    box-shadow: 0 8px 32px 0 rgba(76, 0, 153, 0.5);
    border-radius: 16px;
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
    color: #ff00ff;
  }
  
  .card-text {
    color: #e6e1e5;
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
  
  /* Animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes zoomIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  </style>
  