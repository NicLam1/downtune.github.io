<template>
  <div class="band-profile-container">
    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-spinner">
      <i class="fas fa-spinner fa-spin fa-3x"></i>
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
        <!-- ... rest of your template ... -->
      </main>

      <!-- Modal for Band Member Details -->
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <!-- ... modal content ... -->
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
        featuredArtist.value.spotifyEmbedUrl = `https://open.spotify.com/embed/artist/${artistId}`;
      } catch (err) {
        console.error("Error fetching artist's Spotify embed URL:", err);
      }
    };

    const fetchBandData = async (bandId) => {
      try {
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
          await fetchRecommendedArtistsByGenres(foundBand.genres);
        } else {
          console.error("Band not found");
          error.value = true;
        }
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

/* ... rest of your existing styles ... */

/* Example for reference */
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

/* ... rest of your existing styles ... */
</style>
