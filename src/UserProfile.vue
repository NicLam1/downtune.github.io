
<template>
  <div class="band-profile-container">

    <!-- uSER Profile Content -->
    <div class="band-profile-content">
      <!-- Banner -->
      <div class="banner" :style="{ backgroundImage: `url('../userProfile/starfall-night-sky-mountains-aesthetic-gif-preview-desktop-wallpaper.gif')` }" alt="Banner Image">
        <div class="banner-overlay justify-content-center">
          <h1 class="band-name">Welcome to your profile,  
            <div v-if="username">{{ username }}</div>
            </h1>
        </div>
      </div>

      <main class="container py-5">
        <!--  Section -->
        <section class="row biography-genres-section mb-5">
          <div class="col-md-6 biography-section">
            <h2 class="section-title"><i class="fas fa-sliders-h"></i> Saved Event Preferences</h2>
            <div v-if="preferences">
            <p><strong>Genres:</strong> {{ preferences.genres.join(', ') }}</p>
            <p><strong>Event Type:</strong> {{ preferences.eventType }}</p>
            <p><strong>Budget:</strong> {{ preferences.budget }}</p>
            <p><strong>Event Duration:</strong> {{ preferences.eventDuration }}</p>
            <p><strong>Event Location:</strong> {{ preferences.eventLocation }}</p>
        </div>  
            <div v-else>
        <p>No preferences found, click "Change Preferences" to add one</p>
        </div>
        </div>
         
        </section>

        <!-- Change Event Preferences -->
        <section class="members-section mb-5">
        <h3 class="section-title"><i class="fas fa-cogs"></i> Change Event Preferences</h3>
        <div class="row">
            <div class="col-md-4 member-card my-2">
            <!-- Button to navigate to questionComponent.vue -->
            <router-link to="/register/user" class="btn btn-primary w-100 d-flex align-items-center justify-content-center">
                <i class="fas fa-cogs mr-2"></i> Change Preferences
            </router-link>
            </div>
        </div>
        </section>


        <!--  Section -->
        <section class="events-section mb-5">
          <h3 class="section-title"><i class="fas fa-user-cog"></i> Change Email / Username / Password</h3>
          <div class="row">
            <!-- Upcoming Events -->
            <div class="col-md-6 mb-4">
              <h4>Upcoming Events</h4>
              <ul class="list-group">
                <!-- <li
                  class="list-group-item event-item"
                  v-for="event in band.upcoming_events"
                  :key="event.name + event.date"
                > -->
                  <strong> formatDate(event.date) </strong> -  event.name @ event.location
                <!-- </li> -->
                <!-- <li v-if="!band.upcoming_events.length" class="list-group-item">No upcoming events.</li> -->
              </ul>
            </div>
            <!-- Past Events -->
            <div class="col-md-6 mb-4">
              <h4>Past Events</h4>
              <ul class="list-group">
                <!-- <li
                  class="list-group-item event-item"
                  v-for="event in band.past_events"
                  :key="event.name + event.date"
                > -->
                  <strong> formatDate(event.date) </strong> -  event.name  @  event.location 
                <!-- </li> -->
                
              </ul>
            </div>
          </div>
        </section>

     
      </main>

   
    </div>
  </div>



  
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default {
  name: 'BandProfile',
  data() {
    return {
      preferences: null,
      username: null, // To store the user's display name
    };
  },
  mounted() {
    this.checkAuthState();
  },
  methods: {
    checkAuthState() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.username = user.displayName || "User"; // Get the display name or set a default value
          this.fetchUserPreferences(user.uid);
        } else {
          console.error("No user is currently signed in.");
        }
      });
    },
    async fetchUserPreferences(userId) {
      try {
        const docRef = doc(db, 'userPreferences', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.preferences = docSnap.data();
        } else {
          console.error('No preferences found for this user.');
        }
      } catch (error) {
        console.error('Error retrieving preferences:', error);
      }
    },
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
  
  .artist-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
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
  </style>
  
  
  
  