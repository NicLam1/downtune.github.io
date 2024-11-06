<template>
  <div class="band-profile-container">
    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-spinner">
      <i class="fas fa-spinner fa-spin fa-3x"></i>
    </div>

    <!-- Band Profile Content -->
    <div v-else-if="band" class="band-profile-content">
      <!-- Band Banner -->
      <div class="banner" :style="{ backgroundImage: `url('${band.thumbnail}')` }">
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
              <button v-if="isOwner" class="edit-button" @click="openEditor('biography')">
                <i class="fas fa-edit"></i>
              </button>
            </h2>
            <p class="biography" v-html="band.biography"></p>
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
          <h3 class="section-title"><i class="fas fa-users"></i> Band Members</h3>
          <div class="row">
            <div
              class="col-md-4 member-card my-2"
              v-for="member in band.members"
              :key="member"
            >
              <div class="card text-center">
                <div class="card-body">
                  <i class="fas fa-user fa-3x mb-3"></i>
                  <h5 class="card-title">{{ member }}</h5>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Events Section -->
        <section class="events-section mb-5">
          <h3 class="section-title"><i class="fas fa-calendar-alt"></i> Events</h3>
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
                  <strong>{{ formatDate(event.date) }}</strong> - {{ event.name }} @ {{ event.location }}
                </li>
                <li v-if="!band.upcoming_events.length" class="list-group-item">No upcoming events.</li>
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
                  <strong>{{ formatDate(event.date) }}</strong> - {{ event.name }} @ {{ event.location }}
                </li>
                <li v-if="!band.past_events.length" class="list-group-item">No past events.</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Call to Action Section -->
        <section class="call-to-action text-center py-5">
          <div class="container">
            <h2 class="cta-title">Stay updated on {{ band.name }}</h2>

            <form @submit.prevent="submitForm" class="mx-auto" style="max-width: 400px;">
              <div class="input-group mb-3">
                <input
                  type="email"
                  class="form-control"
                  placeholder="Enter your email"
                  v-model="email"
                  required
                />
                <button class="btn btn-primary" type="submit">
                  <i class="fas fa-envelope"></i> Subscribe
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>

    <!-- Popup Editor -->
    <PopupEditor
      v-if="editorVisible"
      :visible="editorVisible"
      :content="editorContent"
      @close="closeEditor"
      @save="saveContent"
    />
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PopupEditor from './PopupEditor.vue';

export default {
  name: 'BandProfile',
  components: {
    PopupEditor,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const band = ref(null);
    const email = ref('');
    const loading = ref(true);
    const error = ref(false);
    const editorVisible = ref(false);
    const editorContent = ref('');
    const isOwner = ref(true); // Replace with actual logic to check if the user is the owner

    const submitForm = () => {
      console.log('Submitted email:', email.value);
      alert('Thanks for subscribing!');
      email.value = '';
    };

    const fetchBandData = async () => {
      try {
        const response = await axios.get('/MOCK_DATA.json');
        const allBands = response.data;
        console.log('All bands:', allBands);

        // Always select the first band
        const foundBand = allBands[0];

        if (foundBand) {
          // Ensure all required properties are arrays
          foundBand.genres = Array.isArray(foundBand.genres) ? foundBand.genres : [];
          foundBand.members = Array.isArray(foundBand.members) ? foundBand.members : [];
          foundBand.upcoming_events = Array.isArray(foundBand.upcoming_events) ? foundBand.upcoming_events : [];
          foundBand.past_events = Array.isArray(foundBand.past_events) ? foundBand.past_events : [];
          band.value = foundBand;
        } else {
          console.error('Band not found');
          error.value = true;
        }
      } catch (err) {
        console.error('Error fetching band data:', err);
        error.value = true;
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(dateStr);
      if (isNaN(date)) return dateStr;
      return date.toLocaleDateString(undefined, options);
    };

    const openEditor = (section) => {
      console.log('openEditor called with section:', section); // Debug log
      if (section === 'biography') {
        editorContent.value = band.value.biography;
      }
      editorVisible.value = true;
      console.log('editorVisible:', editorVisible.value); // Debug log
      console.log('editorContent:', editorContent.value); // Debug log
    };

    const closeEditor = () => {
      editorVisible.value = false;
    };

    const saveContent = (content) => {
      if (editorContent.value === band.value.biography) {
        band.value.biography = content;
      }
      // Save the updated content to the server or database
      console.log('Saved content:', content);
    };

    onMounted(() => {
        fetchBandData();
    });

    return {
      band,
      email,
      submitForm,
      formatDate,
      loading,
      error,
      editorVisible,
      editorContent,
      openEditor,
      closeEditor,
      saveContent,
      isOwner,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.band-profile-container {
  background: linear-gradient(135deg, rgba(14, 0, 19, 0.85), rgba(17, 0, 36, 0.9));
  min-height: 100vh;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
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
  font-family: 'Poppins', sans-serif;
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
.call-to-action {
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
  content: '';
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
  background: linear-gradient(135deg, rgba(31, 0, 61, 0.85), rgba(101, 0, 163, 0.85));
  padding: 4rem 0;
  border-radius: 16px;
  animation: fadeIn 1s ease forwards;
}

.cta-title {
  font-size: 2.5rem;
  color: #ff66ff;
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
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

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounceIn {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
}

@keyframes growWidth {
  from { width: 0; }
  to { width: 50px; }
}

@keyframes popIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.icon {
  color: #333;
  margin-right: 8px;
}

.loading-spinner {
  text-align: center;
  margin-top: 50px;
}

.biography-section .edit-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #007bff;
  margin-left: 10px;
}

.masked-icon {
  background-color: #007bff; /* Background color */
  color: #fff; /* Icon color */
  padding: 5px; /* Padding around the icon */
  border-radius: 50%; /* Rounded corners */
  display: inline-block; /* Ensure the icon is inline-block */
}
</style>
