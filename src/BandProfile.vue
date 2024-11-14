<template>
  <div class="band-profile-container">
    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-spinner-container">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin fa-3x"></i>
      </div>
    </div>

    <!-- Band Profile Content -->
    <div v-else-if="band" class="band-profile-content">
      <!-- Band Banner -->
      <div
        class="banner"
        :class="{ 'banner-loaded': bannerLoaded }"
        :style="{ backgroundImage: `url('${band.banner}')` }"
      >
        <div class="banner-overlay justify-content-center">
          <h1 class="band-name mx-4">{{ band.name }}</h1>
        </div>
      </div>

      <main class="container py-5">
        <!-- Biography and Genres Section -->
        <section class="row biography-genres-section mb-5">
          <div class="col-md-6 biography-section">
            <h2 class="section-title">
              <i class="fas fa-info-circle"></i> Biography
            </h2>
            <p class="biography">{{ band.biography }}</p>
          </div>
          <div class="col-md-6 genres-section">
            <h3 class="section-title"><i class="fas fa-music"></i> Genres</h3>
            <div class="genres-list">
              <span
                v-for="genre in band.genres"
                :key="genre"
                class="badge genre-pill fs-4 mx-2 px-4 py-2 mt-md-2"
              >
                {{ genre }}
              </span>
            </div>
          </div>
        </section>

        <!-- Band Members Section -->
        <section class="members-section mb-5">
          <h3 class="section-title">
            <i class="fas fa-users"></i> Band Members
          </h3>
          <div class="row">
            <div
              class="col-md-4 member-card my-2"
              v-for="member in band.members"
              :key="member.id"
              @click="openModal(member)"
              role="button"
              tabindex="0"
              @keyup.enter="openModal(member)"
            >
              <div class="card text-center">
                <div class="card-body text-light">
                  <img
                    v-if="band.id == 60"
                    src="/band/justinthumb.jpg"
                    class="member-picture mb-3"/>
                  <img v-else
                    :src="member.picture || 'https://placehold.co/500x500/purple/white?text=Member'"
                    :alt="member"
                    class="member-picture mb-3"
                  />
                  <h5 class="card-title">{{ member }}</h5>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Events Section -->
        <section class="events-section mb-5">
          <h3 class="section-title">
            <i class="fas fa-calendar-alt"></i> Events
          </h3>
          <div class="row">
            <!-- Upcoming Events -->
            <div class="col-md-6">
              <h4 class="fw-bold">Upcoming Events</h4>
              <ul class="list-group">
                <li
                  class="list-group-item event-item"
                  v-for="event in band.upcoming_events"
                  :key="event.name + event.date"
                >
                  <strong>{{ formatDate(event.date) }}</strong> -
                  {{ event.name }} @ {{ event.location }}
                </li>
                <li v-if="!band.upcoming_events.length" class="list-group-item">
                  No upcoming events.
                </li>
              </ul>
            </div>
            <!-- Past Events -->
            <div class="col-md-6 mb-4 mt-4 mt-md-0">
              <h4 class="fw-bold">Past Events</h4>
              <ul class="list-group">
                <li
                  class="list-group-item event-item"
                  v-for="event in band.past_events"
                  :key="event.name + event.date"
                >
                  <strong>{{ formatDate(event.date) }}</strong> -
                  {{ event.name }} @ {{ event.location }}
                </li>
                <li v-if="!band.past_events.length" class="list-group-item">
                  No past events.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Artist Playlist Section -->
        <section class="artist-playlist-section mb-5">
          <h3 class="section-title">
            <i class="fas fa-headphones-alt"></i> Featured Artist Playlist
          </h3>
          <div v-if="featuredArtist" class="featured-artist">
            <!-- Embedded Spotify Player -->
            <div class="spotify-embed">
              <iframe
                v-if="featuredArtist.spotifyEmbedUrl"
                :src="featuredArtist.spotifyEmbedUrl"
                width="100%"
                height="380"
                frameborder="0"
                allowtransparency="true"
                allow="encrypted-media"
                :aria-label="`Spotify player for ${featuredArtist.name}`"
              ></iframe>
              <div v-else class="text-center text-light">
                <p>Spotify player not available.</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-light">
            <p>Loading featured artist...</p>
          </div>
        </section>

        <!-- Artist Recommendations Section -->
        <section class="artist-recommendations-section">
          <h3 class="section-title">
            <i class="fas fa-guitar"></i> Recommended Artists
          </h3>
          <div class="scroll-container" :class="{ paused: isScrollingPaused }">
            <div class="scroll-content" ref="scrollContent">
              <div
                class="recommended-artist-card my-2"
                v-for="artist in filteredRecommendedArtists"
                :key="artist.id"
                @mouseover="pauseScrolling"
                @mouseleave="resumeScrolling"
              >
                <div class="card text-center">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <img
                      :src="artist.image"
                      :alt="artist.name"
                      class="artist-image mb-3"
                      loading="lazy"
                    />
                    <h5 class="card-title text-light">{{ artist.name }}</h5>
                    <a
                      :href="artist.external_urls.spotify"
                      target="_blank"
                      class="btn btn-spotify mt-2"
                      :aria-label="`Listen to ${artist.name} on Spotify`"
                    >
                      <i class="fab fa-spotify me-2"></i>Listen on Spotify
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="filteredRecommendedArtists.length === 0" class="text-center text-light">
            <p>No recommended artists available.</p>
          </div>
        </section>

        <!-- Call to Action Section -->
        <section class="call-to-action text-center py-5">
          <div class="container">
            <h2 class="cta-title">Stay updated on {{ band.name }}</h2>

            <form @submit.prevent="submitForm" class="mx-auto" style="max-width: 400px">
              <div class="mb-3">
                <input
                  v-model="email"
                  type="email"
                  class="form-control styled-select"
                  id="emailInput"
                  placeholder="Enter your email"
                  required
                  aria-label="Email address"
                />
              </div>
              <button type="submit" class="btn btn-primary w-100">
                <i class="fas fa-envelope"></i> Subscribe
              </button>
            </form>

            <h2 class="cta-title">Contact us here!</h2>
              <div class="social-icons">
                <!-- Facebook search link -->
                <a :href="'https://www.facebook.com/search/top?q=' + encodeURIComponent(band.name)" target="_blank" aria-label="Facebook">
                  <i class="fab fa-facebook"></i>
                </a>

                <!-- Twitter search link -->
                <a :href="'https://twitter.com/search?q=' + encodeURIComponent(band.name)" target="_blank" aria-label="Twitter">
                  <i class="fab fa-twitter"></i>
                </a>

                <!-- Instagram profile link -->
                <a :href="'https://instagram.com/' + band.name.trim().replace(/\s+/g, '')" target="_blank"  aria-label="Instagram">
                  <i class="fab fa-instagram"></i>
                </a>

              </div>
          </div>
        </section>
      </main>

      <!-- Modal for Band Member Details -->
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <button class="close-button" @click="closeModal" aria-label="Close Modal">
            <i class="fas fa-times"></i>
          </button>
          <div class="modal-body">
            <img v-if="band.id == 60" src="/band/justinthumb.jpg" class="modal-member-picture mb-4">
            <img v-else
              :src="selectedMember.picture || 'https://placehold.co/500x500/purple/white?text=Band+Member'"
              :alt="selectedMember.name"
              class="modal-member-picture mb-4"
            />
            <h2 class="modal-member-name">{{ selectedMember }}</h2>
            <div v-if="band.id == 60">
              <p><strong>Age:</strong> 30</p>
              <p><strong>Nationality:</strong> Canadian</p>
              <p><strong>Instrument:</strong> Vocals</p>
            </div>
            <div v-else>
              <p><strong>Age:</strong> 23</p>
              <p><strong>Nationality:</strong> Singaporean</p>
              <p><strong>Instrument:</strong> Vocals</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Section -->
      <!-- <footer class="text-center">
        <p>© 2024 Not Like Us, G3-Group 8 , All Rights Reserved.</p>
      </footer> -->
    </div>

    <!-- Error Message -->
    <div v-else class="error-message">
      <p>Band not found.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import bandProfileCache from "./cache.js"; // Import the cache

export default {
  name: "BandProfile",
  setup() {
    const route = useRoute();
    const band = ref(null);
    const email = ref("");
    const loading = ref(true);
    const error = ref(false);
    const recommendedArtists = ref([]);
    const spotifyAccessToken = ref("");
    const featuredArtist = ref(null);
    const isScrollingPaused = ref(false);
    const scrollContent = ref(null);

    // Modal State
    const isModalOpen = ref(false);
    const selectedMember = ref({
      name: "",
      age: "",
      nationality: "",
      instrument: "",
      picture: "",
    });

    // New Reactive Variable for Banner Load State
    const bannerLoaded = ref(false);

    const submitForm = () => {
      console.log("Submitted email:", email.value);
      alert("Thanks for subscribing!");
      email.value = "";
    };

    const fetchSpotifyAccessToken = async () => {
      try {
        const clientId = import.meta.env.VITE_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          "grant_type=client_credentials",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
            },
          }
        );
        spotifyAccessToken.value = response.data.access_token;
      } catch (err) {
        console.error("Error fetching Spotify access token:", err);
      }
    };

    const fetchRecommendedArtistsByGenres = async (genres) => {
      try {
        if (!spotifyAccessToken.value) {
          console.warn("Spotify access token not available.");
          return;
        }

        let allArtists = [];

        // Fetch artists for each genre
        for (const genre of genres) {
          const response = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
              Authorization: `Bearer ${spotifyAccessToken.value}`,
            },
            params: {
              q: `genre:"${genre}"`,
              type: "artist",
              limit: 6, // Fetch a smaller number per genre for diversity
            },
          });

          const artists = response.data.artists.items;
          allArtists = allArtists.concat(artists);
        }

        // Remove duplicate artists based on their ID
        const uniqueArtists = Array.from(
          new Map(allArtists.map((artist) => [artist.id, artist])).values()
        );

        // Sort artists alphabetically by name for consistency
        uniqueArtists.sort((a, b) => a.name.localeCompare(b.name));

        // Check if a featured artist is already stored in localStorage
        const storedFeaturedArtistId = localStorage.getItem(
          `featuredArtist_${band.value.id}`
        );
        if (storedFeaturedArtistId) {
          const storedArtist = uniqueArtists.find(
            (artist) => artist.id === storedFeaturedArtistId
          );
          if (storedArtist) {
            featuredArtist.value = storedArtist;
          } else {
            // Fallback to the first artist if stored ID is not found
            featuredArtist.value = uniqueArtists[0];
            localStorage.setItem(
              `featuredArtist_${band.value.id}`,
              featuredArtist.value.id
            );
          }
        } else {
          // Select the first artist as the featured artist
          if (uniqueArtists.length > 0) {
            featuredArtist.value = uniqueArtists[0];
            // Store the featured artist ID
            localStorage.setItem(
              `featuredArtist_${band.value.id}`,
              featuredArtist.value.id
            );
          }
        }

        if (featuredArtist.value) {
          await fetchArtistSpotifyEmbedUrl(featuredArtist.value.id);

          // Exclude the featured artist from recommended artists
          const remainingArtists = uniqueArtists.filter(
            (artist) => artist.id !== featuredArtist.value.id
          );

          // Limit to first 10 recommended artists for the carousel
          recommendedArtists.value = remainingArtists
            .slice(0, 10)
            .map((artist) => ({
              id: artist.id,
              name: artist.name,
              image: artist.images[0]?.url || "https://via.placeholder.com/300", // Fallback image
              external_urls: artist.external_urls,
            }));
        }
      } catch (err) {
        console.error("Error fetching recommended artists:", err);
      }
    };

    const fetchArtistSpotifyEmbedUrl = async (artistId) => {
      try {
        if (!spotifyAccessToken.value) {
          console.warn("Spotify access token not available.");
          return;
        }

        // Fetch the artist's information to get the Spotify URI
        const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: {
            Authorization: `Bearer ${spotifyAccessToken.value}`,
          },
        });

        // Convert URI to embed URL
        if(band.value.id === 60){
          featuredArtist.value.spotifyEmbedUrl = `https://open.spotify.com/embed/artist/1uNFoZAHBGtllmzznpCI3s`;
        }
        else{
          featuredArtist.value.spotifyEmbedUrl = `https://open.spotify.com/embed/artist/${artistId}`;
        }
      } catch (err) {
        console.error("Error fetching artist's Spotify embed URL:", err);
      }
    };

    const fetchBandData = async (bandId) => {
      try {
        // Check if the band data is already in the cache
        if (bandProfileCache[bandId]) {
          band.value = bandProfileCache[bandId];
          console.log("Loaded band data from cache");
        } else {
          const response = await axios.get("/MOCK_DATA.json");
          const allBands = response.data;

          // Find the band with the matching ID
          const foundBand = allBands.find((b) => b.id === bandId);

          if (foundBand) {
            // Ensure all required properties are arrays
            foundBand.genres = Array.isArray(foundBand.genres) ? foundBand.genres : [];
            foundBand.members = Array.isArray(foundBand.members) ? foundBand.members : [];
            foundBand.upcoming_events = Array.isArray(foundBand.upcoming_events)
              ? foundBand.upcoming_events
              : [];
            foundBand.past_events = Array.isArray(foundBand.past_events)
              ? foundBand.past_events
              : [];

            band.value = foundBand;

            // Cache the band data
            bandProfileCache[bandId] = foundBand;

            console.log("Fetched band data and stored in cache");
          } else {
            console.error("Band not found");
            error.value = true;
          }
        }

        // Preload the banner image
        const img = new Image();
        img.src = band.value.banner;
        img.onload = () => {
          bannerLoaded.value = true;
        };
        img.onerror = () => {
          console.error("Failed to load banner image.");
          // Optionally, set a default banner or handle the error
          bannerLoaded.value = true; // Even on error, remove the loader
        };

        // Fetch recommended artists based on the band's genres
        await fetchSpotifyAccessToken();
        await fetchRecommendedArtistsByGenres(band.value.genres);
      } catch (err) {
        console.error("Error fetching band data:", err);
        error.value = true;
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const options = { year: "numeric", month: "long", day: "numeric" };
      const date = new Date(dateStr);
      if (isNaN(date)) return dateStr;
      return date.toLocaleDateString(undefined, options);
    };

    const pauseScrolling = () => {
      isScrollingPaused.value = true;
    };

    const resumeScrolling = () => {
      isScrollingPaused.value = false;
    };

    const filteredRecommendedArtists = computed(() => recommendedArtists.value);

    // Modal Methods
    const openModal = (member) => {
      selectedMember.value = member;
      isModalOpen.value = true;
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    };

    const closeModal = () => {
      isModalOpen.value = false;
      document.body.style.overflow = "auto"; // Restore scrolling
    };

    const updateBandViews = async (bandId) => {
      const bandViewRef = doc(db, "bandviews", bandId.toString());
      const bandViewDoc = await getDoc(bandViewRef);

      console.log("Incrementing view count for band", bandId);
      if (bandViewDoc.exists()) {
        // Increment the view count if the document exists
        await updateDoc(bandViewRef, {
          views: increment(1),
        });
      } else {
        // Create a new document with the initial view count if it does not exist
        await setDoc(bandViewRef, {
          views: 1,
        });
      }
    };

    onMounted(() => {
      const bandId = parseInt(route.params.id, 10);
      if (isNaN(bandId)) {
        console.error("Invalid band ID");
        error.value = true;
        loading.value = false;
      } else {
        fetchBandData(bandId);
        updateBandViews(bandId);
      }
    });

    return {
      band,
      email,
      submitForm,
      formatDate,
      loading,
      error,
      recommendedArtists,
      featuredArtist,
      isScrollingPaused,
      filteredRecommendedArtists,
      pauseScrolling,
      resumeScrolling,
      scrollContent,
      // Modal State and Methods
      isModalOpen,
      selectedMember,
      openModal,
      closeModal,
      updateBandViews,
      // New Reactive Variable
      bannerLoaded,
    };
  },

};

</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

.band-profile-container {
  background: linear-gradient(135deg, rgba(14, 0, 19, 0.85), rgba(17, 0, 36, 0.9));
  min-height: 100vh;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  position: relative;
}

/* Loading Spinner Styles */
.loading-spinner-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.loading-spinner {
  text-align: center;
}

/* Banner Styles with Fade-In */
.banner {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  /* Initial state for fade-in */
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.banner-loaded {
  opacity: 1;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
}

.band-name {
  position: relative;
  font-family: "Poppins", sans-serif;
  font-size: 8vw;
  text-align: center;
  color: #ffffff;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  z-index: 1;
  animation: bounceIn 1s ease;
}

.biography-section,
.genres-section,
.members-section,
.events-section,
.call-to-action,
.artist-recommendations-section,
.artist-playlist-section {
  animation: fadeInUp 1s ease forwards;
  opacity: 0;
}

.section-title {
  font-size: 2rem;
  color: #ff6f61;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  animation: fadeInDown 0.5s ease forwards;
}

.section-title::after {
  content: "";
  position: absolute;
  width: 50px;
  height: 3px;
  background: #ff6f61;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
  animation: growWidth 0.5s ease forwards;
}

.biography {
  font-size: 1.2rem;
  text-align: left;
  margin-bottom: 1rem;
  color: #e6e1e5;
  line-height: 1.6;
  animation: fadeIn 1s ease forwards;
}

.genres-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.genre-badge {
  animation: popIn 0.5s ease forwards;
  background: #7100e0;
  border-radius: 50px;
  padding: 7px 13px 7px 13px;
  margin-bottom: 5px;
  margin-left: 5px;
}

.member-card {
  cursor: pointer;
  outline: none;
}

.member-card:focus .card {
  box-shadow: 0 0 0 3px #ff6f61;
}

.member-card .card {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 16px;
  padding: 20px;
  transition: transform 0.3s;
  animation: fadeIn 1s ease forwards;
}

.member-card .card:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #e600e8, #ff66ff);
}

.member-picture {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #ffffff;
  margin: 0 auto 15px auto;
}

.events-section .row {
  animation: fadeIn 1s ease forwards;
}

.call-to-action {
  background: linear-gradient(135deg, rgba(31, 0, 61, 0.85), rgba(101, 0, 163, 0.85));
  padding: 4rem 0;
  border-radius: 16px;
  animation: fadeIn 1s ease forwards;
}

.cta-title {
  font-size: 2.5rem;
  color: #ff66ff;
  margin-bottom: 1rem;
  font-family: "Poppins", sans-serif;
  animation: fadeInDown 0.5s ease forwards;
}

.mx-auto {
  margin-bottom: 1rem;
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
  transition: background-color 0.3s, transform 0.3s;
}

.styled-select::placeholder {
  color: #b8a1c9;
}

.styled-select:focus {
  outline: none;
  background: rgba(102, 0, 153, 0.5);
  transform: scale(1.02);
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

.social-icons a {
  color: #ff66ff;
  margin: 0 15px;
  font-size: 1.5rem;
  transition: transform 0.3s, color 0.3s;
}

.social-icons a:hover {
  transform: scale(1.2);
  color: #ff00ff;
}

footer p {
  margin-top: 1rem;
  color: #e6e1e5;
  animation: fadeIn 1s ease forwards;
}

.error-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #ff6f61;
  font-size: 1.5rem;
}

.artist-image {
  width: 100%;
  height: auto;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.featured-artist-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #1db954;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.featured-artist h4 {
  color: #1db954;
  margin-bottom: 0.5rem;
}

.featured-artist .btn-success {
  background-color: #1db954;
  border: none;
}

.featured-artist .btn-success:hover {
  background-color: #1ed760;
}

.spotify-embed {
  margin-top: 20px;
  text-align: center;
}

.artist-playlist-section .list-group-item {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #e6e1e5;
}

.list-group {
  background-color: #1db954 !important;
}

.list-group-item {
  padding-top: 10px;
  padding-bottom: 10px;
  color: #e6e1e5;
  background: linear-gradient(135deg, rgb(59, 1, 80), rgb(61, 4, 126));
}

.artist-playlist-section .list-group-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.artist-recommendations-section {
  overflow: hidden;
  height: 400px; /* Increased height to accommodate full card height */
}

.scroll-container {
  position: relative;
  width: 100%;
  /* overflow: hidden; */
  height: 300px; /* Match the artist-recommendations-section height */
  display: flex;
  align-items: center;
}

.scroll-content {
  display: flex;
  animation: scroll 25s linear infinite;
}

.scroll-container.paused .scroll-content {
  animation-play-state: paused;
}

.recommended-artist-card {
  flex: 0 0 auto;
  width: 300px;
  margin-right: 20px;
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure card fills the container's height */
}

.recommended-artist-card:hover {
  transform: scale(1.1);
}

.artist-recommendations-section .card {
  background: linear-gradient(135deg, #8e2de2, #4a00e0);
  border: none;
  border-radius: 16px;
  transition: transform 0.3s, background 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%; /* Make card fill the recommended-artist-card's height */
}

.artist-recommendations-section .card:hover {
  background: linear-gradient(135deg, #4a00e0, #8e2de2);
}

.artist-recommendations-section .artist-image {
  border-radius: 50%;
  border: 3px solid #ffffff;
  width: 100px; /* Fixed size for consistency */
  height: 100px;
  object-fit: cover;
  margin: 0 auto 15px auto;
}

.btn-spotify {
  background-color: #1db954;
  border: none;
  color: #fff;
  transition: background-color 0.3s, transform 0.3s;
  align-self: center;
}

.btn-spotify:hover {
  background-color: #1ed760;
  transform: scale(1.05);
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

/* Infinite Scroll Animation */
@keyframes scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

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

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-30px);
  }

  60% {
    transform: translateY(-15px);
  }
}

@keyframes growWidth {
  from {
    width: 0;
  }

  to {
    width: 50px;
  }
}

@keyframes popIn {
  from {
    transform: scale(0);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(17, 0, 36, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease forwards;
}

.modal-content {
  background: linear-gradient(135deg, #6f00e8, #c603ff);
  padding: 30px;
  border-radius: 16px;
  position: relative;
  width: 90%;
  max-width: 500px;
  color: #ffffff;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 0.5s ease forwards;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s;
}

.close-button:hover {
  color: #ff6f61;
}

.modal-body {
  text-align: center;
}

.modal-member-picture {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #ffffff;
  margin-bottom: 20px;
}

.modal-member-name {
  font-size: 2rem;
  margin-bottom: 10px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .band-name {
    font-size: 12vw;
  }

  .modal-content {
    padding: 20px;
  }

  .modal-member-picture {
    width: 200px;
    height: 200px;
  }

  .modal-member-name {
    font-size: 1.5rem;
  }
}
</style>
