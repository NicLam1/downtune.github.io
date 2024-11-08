<template>
  <div class="band-profile-container">
    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-spinner">
      <i class="fas fa-spinner fa-spin fa-3x"></i>
    </div>

    <!-- Band Profile Content -->
    <div v-else-if="band" class="band-profile-content">
      <!-- Band Banner -->
      <div class="banner" :style="{ backgroundImage: `url('${band.banner}')` }">
        <div class="banner-overlay justify-content-center">
          <h1 class="band-name">{{ band.name }}</h1>
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
                class="badge bg-primary genre-badge genre-pill fs-3 mx-2"
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
              :key="member"
            >
              <div class="card text-center">
                <div class="card-body text-light">
                  <i class="fas fa-user fa-3x mb-3"></i>
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
            <div class="col-md-6 mb-4">
              <h4>Upcoming Events</h4>
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
            <div class="col-md-6 mb-4">
              <h4>Past Events</h4>
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

        <!-- Spotify Playlist Section -->
        <section class="spotify-playlist-section mb-5">
          <h3 class="section-title">
            <i class="fab fa-spotify"></i> Spotify Playlist
          </h3>
          <div class="spotify-embed">
            <iframe
              :src="spotifyPlaylistUrl"
              width="100%"
              height="380"
              frameborder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <button
            v-if="!spotifyLoggedIn"
            @click="loginToSpotify"
            class="btn btn-success mt-3"
          >
            <i class="fab fa-spotify"></i> Login to Spotify
          </button>
          <button
            v-if="spotifyLoggedIn"
            @click="addToFavorites"
            class="btn btn-primary mt-3"
          >
            <i class="fas fa-heart"></i> Add Playlist to Favorites
          </button>
        </section>

        <!-- Artist Recommendations Section -->
        <section class="artist-recommendations-section mb-5">
          <h3 class="section-title">
            <i class="fas fa-guitar"></i> Recommended Artists
          </h3>
          <div class="row">
            <div
              class="col-md-4 recommended-artist-card my-2"
              v-for="artist in recommendedArtists"
              :key="artist.id"
            >
              <div class="card text-center">
                <div class="card-body">
                  <img
                    :src="artist.image"
                    :alt="artist.name"
                    class="artist-image mb-3"
                  />
                  <h5 class="card-title">{{ artist.name }}</h5>
                  <button
                    @click="playArtistTopTrack(artist.id)"
                    class="btn btn-outline-primary mt-2"
                  >
                    <i class="fas fa-play"></i> Play Top Track
                  </button>
                </div>
              </div>
            </div>
            <div
              v-if="recommendedArtists.length === 0"
              class="col-12 text-center text-muted"
            >
              <p>No recommended artists available.</p>
            </div>
          </div>
        </section>

        <!-- Call to Action Section -->
        <section class="call-to-action text-center py-5">
          <div class="container">
            <h2 class="cta-title">Stay updated on {{ band.name }}</h2>

            <form
              @submit.prevent="submitForm"
              class="mx-auto"
              style="max-width: 400px"
            >
              <div class="mb-3">
                <input
                  v-model="email"
                  type="email"
                  class="form-control styled-select"
                  id="emailInput"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100">
                <i class="fas fa-envelope"></i> Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <!-- Footer Section -->
      <footer class="text-center">
        <div class="social-icons mb-3">
          <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
          <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" aria-label="Instagram"
            ><i class="fab fa-instagram"></i
          ></a>
        </div>
        <p>Contact {{ band.name }} here!</p>
      </footer>
    </div>

    <!-- Error Message -->
    <div v-else class="error-message">
      <p>Band not found.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "BandProfile",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const band = ref(null);
    const email = ref("");
    const loading = ref(true);
    const error = ref(false);
    const spotifyLoggedIn = ref(false);
    const recommendedArtists = ref([]);
    const spotifyPlaylistUrl = ref("");

    // Predefined list of Spotify Playlist IDs
    const playlistIds = [
      "37i9dQZF1DXcBWIGoYBM5M", // Today's Top Hits - Pop
      "37i9dQZF1DX0XUsuxWHRQd", // RapCaviar - Hip-Hop
      "37i9dQZF1DX1lVhptIYRda", // Rock Classics - Rock
      "37i9dQZF1DX4JAvHpjipBk", // Mood Booster - Pop
      "37i9dQZF1DWXRqgorJj26U", // Feel Good Friday - Pop
      "37i9dQZF1DX2yvmlOdMYzV", // Pop Rising - Pop
      "37i9dQZF1DX1gIWILh4VV6", // Indie Pop - Indie
      "37i9dQZF1DX5Ejj0EkURtP", // Chill Hits - Chill
      "37i9dQZF1DWYBF1d9QID5V", // Hot Hits USA - Pop
      "37i9dQZF1DXaXB8fQg7xif", // Alternative Hits - Alternative
    ];

    // Mapping from Playlist ID to Genre
    const playlistGenreMap = {
      "37i9dQZF1DXcBWIGoYBM5M": "pop",
      "37i9dQZF1DX0XUsuxWHRQd": "hip-hop",
      "37i9dQZF1DX1lVhptIYRda": "rock",
      "37i9dQZF1DX4JAvHpjipBk": "pop",
      "37i9dQZF1DWXRqgorJj26U": "pop",
      "37i9dQZF1DX2yvmlOdMYzV": "pop",
      "37i9dQZF1DX1gIWILh4VV6": "indie",
      "37i9dQZF1DX5Ejj0EkURtP": "chill",
      "37i9dQZF1DWYBF1d9QID5V": "pop",
      "37i9dQZF1DXaXB8fQg7xif": "alternative",
    };

    const submitForm = () => {
      console.log("Submitted email:", email.value);
      alert("Thanks for subscribing!");
      email.value = "";
    };

    const loginToSpotify = () => {
      // Redirect user to Spotify login page (OAuth flow)
      const clientId = import.meta.env.VITE_CLIENT_ID;
      const redirectUri = encodeURIComponent(import.meta.env.VITE_REDIRECT_URI);
      const scopes = encodeURIComponent("user-library-modify");
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}`;
    };

    const addToFavorites = async () => {
      try {
        const accessToken = localStorage.getItem("spotifyAccessToken");
        if (!accessToken) {
          alert("Please login to Spotify first.");
          return;
        }

        const playlistIdMatch = spotifyPlaylistUrl.value.match(
          /playlist\/([a-zA-Z0-9]+)/
        );
        if (!playlistIdMatch || !playlistIdMatch[1]) {
          console.error("Invalid Spotify playlist URL.");
          alert("Invalid playlist URL.");
          return;
        }
        const playlistId = playlistIdMatch[1];
        const response = await axios.put(
          `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        alert("Playlist added to your favorites!");
      } catch (err) {
        console.error("Error adding playlist to favorites:", err);
        alert("Failed to add playlist to favorites. Please try again.");
      }
    };

    const playArtistTopTrack = async (artistId) => {
      try {
        const accessToken = localStorage.getItem("spotifyAccessToken");
        if (!accessToken) {
          alert("Please login to Spotify first.");
          return;
        }

        const response = await axios.get(
          `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              market: "US",
            },
          }
        );

        const trackUri = response.data.tracks[0]?.uri;
        if (trackUri) {
          await axios.put(
            "https://api.spotify.com/v1/me/player/play",
            {
              uris: [trackUri],
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          alert("Playing top track!");
        } else {
          alert("No top track found for this artist.");
        }
      } catch (err) {
        console.error("Error playing artist top track:", err);
        alert("Failed to play the top track. Please try again.");
      }
    };

    const fetchRecommendedArtistsByGenre = async (genre) => {
      try {
        const accessToken = localStorage.getItem("spotifyAccessToken");
        if (!accessToken) {
          console.warn("Spotify access token not found.");
          return;
        }

        // Search for artists by genre
        const response = await axios.get("https://api.spotify.com/v1/search", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            q: `genre:"${genre}"`,
            type: "artist",
            limit: 12, // Fetch 12 artists for a more diverse selection
          },
        });

        const artists = response.data.artists.items;

        // Shuffle the artists to add randomness
        const shuffledArtists = artists.sort(() => 0.5 - Math.random());

        // Select the first 9 artists for display
        recommendedArtists.value = shuffledArtists
          .slice(0, 9)
          .map((artist) => ({
            id: artist.id,
            name: artist.name,
            image: artist.images[0]?.url || "https://via.placeholder.com/300", // Fallback image
          }));
      } catch (err) {
        console.error("Error fetching recommended artists:", err);
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
          foundBand.genres = Array.isArray(foundBand.genres)
            ? foundBand.genres
            : [];
          foundBand.members = Array.isArray(foundBand.members)
            ? foundBand.members
            : [];
          foundBand.upcoming_events = Array.isArray(foundBand.upcoming_events)
            ? foundBand.upcoming_events
            : [];
          foundBand.past_events = Array.isArray(foundBand.past_events)
            ? foundBand.past_events
            : [];

          band.value = foundBand;

          // Assign a Spotify playlist based on the band ID
          const playlistIndex = bandId % playlistIds.length;
          const selectedPlaylistId = playlistIds[playlistIndex];
          spotifyPlaylistUrl.value = `https://open.spotify.com/embed/playlist/${selectedPlaylistId}`;

          // Get genre from the mapping
          const genre = playlistGenreMap[selectedPlaylistId] || "pop"; // Default to 'pop' if not mapped

          // Fetch recommended artists based on genre
          await fetchRecommendedArtistsByGenre(genre);
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

    onMounted(() => {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        if (accessToken) {
          localStorage.setItem("spotifyAccessToken", accessToken);
          spotifyLoggedIn.value = true;
          // Optionally, you can remove the token from the URL
          window.history.replaceState(null, null, " ");
        }
      }

      const bandId = parseInt(route.params.id, 10);
      if (isNaN(bandId)) {
        console.error("Invalid band ID");
        error.value = true;
        loading.value = false;
      } else {
        fetchBandData(bandId);
      }
    });

    return {
      band,
      email,
      submitForm,
      formatDate,
      loading,
      error,
      spotifyPlaylistUrl,
      spotifyLoggedIn,
      loginToSpotify,
      addToFavorites,
      recommendedArtists,
      playArtistTopTrack,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

.band-profile-container {
  background: linear-gradient(
    135deg,
    rgba(14, 0, 19, 0.85),
    rgba(17, 0, 36, 0.9)
  );
  min-height: 100vh;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  position: relative;
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

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #ff6f61;
}

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
  font-size: 10vh;
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
.artist-recommendations-section {
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
  margin: 0.2rem;
  animation: popIn 0.5s ease forwards;
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

.events-section .row {
  animation: fadeIn 1s ease forwards;
}

.call-to-action {
  background: linear-gradient(
    135deg,
    rgba(31, 0, 61, 0.85),
    rgba(101, 0, 163, 0.85)
  );
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
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
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
</style>
