<script>
export default {
  data() {
    return {
      liveNowBoolean: false,
      bands: [
      {
          name: "The Sonic Waves",
          image: "./images/stock band/image1.jpg",
          performanceDate: "October 13, 2024",
          performanceTime: "7:30 PM",
          performanceEndTime: "9:00 PM",
          location: "Singapore",
          livestream: "https://www.youtube.com/watch?v=7Jv9T5gMbkE" 
        },
        {
          name: "Echo & The Vibes",
          image: "./images/stock band/image2.jpg",
          performanceDate: "November 10, 2024",
          performanceTime: "8:30 PM",
          performanceEndTime: "9:00 PM",
          location: "Singapore",
          livestream: null
        },
        {
          name: "Midnight Pulse",
          image: "./images/stock band/image3.jpg",
          performanceDate: "December 1, 2024",
          performanceTime: "9:00 PM",
          performanceEndTime: "11:00 PM",
          location: "Singapore",
          livestream: "https://www.youtube.com/watch?v=sv0g3Y8bdZg"
        },
        {
          name: "Neon Skylight",
          image: "./images/stock band/image4.jpg",
          performanceDate: "October 15, 2024",
          performanceTime: "6:00 PM",
          performanceEndTime: "9:00 PM",
          location: "Singapore",
          livestream: null
        },
        {
          name: "Crimson Aurora",
          image: "./images/stock band/image5.jpg",
          performanceDate: "November 29, 2024",
          performanceTime: "10:00 PM",
          performanceEndTime: "1:00 AM",
          location: "Singapore",
          livestream: "https://youtube.com/watch?v=livestream3"
        },
        {
          name: "Blue Horizon",
          image: "./images/stock band/image6.jpg",
          performanceDate: "December 12, 2024",
          performanceTime: "7:30 PM",
          performanceEndTime: "9:00 PM",
          location: "Singapore",
          livestream: null
        },
        {
          name: "Golden Riff",
          image: "./images/stock band/image7.jpg",
          performanceDate: "November 22, 2024",
          performanceTime: "8:00 PM",
          performanceEndTime: "11:00 PM",
          location: "Singapore",
          livestream: "https://youtube.com/watch?v=livestream4"
        }
      ],
      observer: null
    };
  },
  computed: {
    today() {
      //Use first one for actual date, else use below for debugging
      //return new Date();


      // Set a specific date and time for debugging
      return new Date('2024-10-13T21:00:00+08:00');
      
      // return new Date('2024-12-01T21:00:00+08:00');
    },
    currentLivestream() {


      // Loop through the bands to check their performance time and end time
      const upcomingLivestreams = this.bands
        .filter(band => band.livestream) // Only consider bands with a livestream link
        .map(band => {
          const performanceStart = new Date(band.performanceDate + ' ' + band.performanceTime);
          let performanceEnd = new Date(band.performanceDate + ' ' + band.performanceEndTime);
          
          // Handle performanceEndTime being on the next day (after midnight)
          if (performanceEnd < performanceStart) {
            performanceEnd.setDate(performanceEnd.getDate() + 1); // Set to the next day
          }

          // console.log(`Performance Start: ${performanceStart}`);
          // console.log(`Performance End: ${performanceEnd}`);

          return { ...band, performanceStart, performanceEnd }; // Return band with parsed start/end times
        })
        .sort((a, b) => a.performanceStart - b.performanceStart); // Sort by performance start time

      // Find the first livestream where the current time is within the performance window
      const liveNow = upcomingLivestreams.find(band => {
        // console.log(`Comparing: utcToday = ${today}, performanceStart = ${band.performanceStart}, performanceEnd = ${band.performanceEnd}`);
        return this.today >= band.performanceStart && this.today <= band.performanceEnd;
      });

      console.log(this.today)
      if (liveNow) {
        // If there is a livestream currently playing
        // console.log("HEREEEEEEEEEEE")
        this.liveNowBoolean = true
        return liveNow;
      }
      console.log("No live now, finding next live date")
      console.log(upcomingLivestreams)

      // Find the next available livestream
      const nextLivestream = upcomingLivestreams.find(band => this.today < band.performanceStart);
      console.log(nextLivestream)
      if (nextLivestream) {
        // console.log("HEREEEEEEEEEEE2222222")
        return nextLivestream; // Return the next available livestream
      }

      return null; // No upcoming livestreams
    }
    ,
    nextLivestreamMessage() {
      const nextLivestream = this.currentLivestream;
      // console.log("HEREEEEEEEEEEE2333333")

      // return nextLivestream 
      //   ? `Check back here on ${nextLivestream.performanceDate} at ${nextLivestream.performanceTime} for the next livestream!`
      //   : "No upcoming livestreams available.";
      console.log(nextLivestream)
      return (!this.liveNowBoolean && nextLivestream)
      ? `Check back here on ${nextLivestream.performanceDate} at ${nextLivestream.performanceTime} for the next livestream!`
      : "No upcoming livestreams available.";
    },
    upcomingEvents() {
      return this.bands
        .filter(band => {
          // Convert performanceDate to a Date object for comparison
          const performanceDate = new Date(band.performanceDate);
          return performanceDate >= this.today; // Use the computed "today"
        })
        .sort((a, b) => {
          return new Date(a.performanceDate) - new Date(b.performanceDate);
        });
    },
  },
  methods: {
    fadeIn(entry) {
      if (entry.isIntersecting) {
        // console.log("Entry is intersecting: ", entry.target); // Debugging
        entry.target.classList.add('fade-in');
        this.observer.unobserve(entry.target); // Stop observing after it's visible
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { weekday: 'short' }; // For abbreviated day of the week
      return {
        day: date.getDate(),
        month: date.toLocaleString('default', { month: 'long' }), // Full month name
        year: date.getFullYear(),
        dayOfWeek: date.toLocaleDateString('en-US', options).slice(0, 3) // Get the first three letters
      };
    },
    initObserver() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(this.fadeIn);
      });

      const bandCards = document.querySelectorAll('.band-card');
      bandCards.forEach(card => {
        this.observer.observe(card);
      });
    },
    disconnectObserver() {
      if (this.observer) {
        this.observer.disconnect(); // Clean up observer
      }
    }
  },
  mounted() {
    this.initObserver();
  },
  beforeUnmount() {
    this.disconnectObserver();
  }
};
</script>


<template>
  <div>
    <!-- Livestream Section -->

    <!-- <pre>{{ currentLivestream }}</pre>  -->
    <!-- //debugging ^^^ instead of using console.log -->
    <div class="video-container" v-if="liveNowBoolean">
      <h3>Live Now: {{ currentLivestream.name }} ({{ currentLivestream.performanceTime }} - {{ currentLivestream.performanceEndTime }}) @ {{ currentLivestream.location}}</h3>
      <p></p>
      <iframe
        :src="currentLivestream.livestream.replace('watch?v=', 'embed/') + '?autoplay=1&mute=0'"
        style="width:100% ; height: 50vh;" 
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
    </div>
    <p v-else>{{ nextLivestreamMessage }}</p>
  </div>

<h3>Upcoming events:</h3>
  <div>
    <div v-for="(band, index) in upcomingEvents" :key="index" class="band-card">
      <div class="date-container">
        <div class="circle-container">
          <div class="date-circle">{{ formatDate(band.performanceDate).day }}</div>
          
          <p class="day-of-week">{{ formatDate(band.performanceDate).dayOfWeek }}</p>
        </div>
        <div class="circle-container-beside">
          <p class="month-year">{{ formatDate(band.performanceDate).month }} {{ formatDate(band.performanceDate).year }}</p>
          <p class="month-year-padding">padding</p>
        </div>
      </div>

      <h2>{{ band.name }}</h2>
      <img :src="band.image" :alt="band.name" class="band-image" />
      <p><strong>Date:</strong> {{ band.performanceDate }}</p>
      <p><strong>Time:</strong> {{ band.performanceTime }} - {{ band.performanceEndTime }}</p>
      <p><strong>Location:</strong> {{ band.location }}</p>
      <p v-if="band.livestream">
        <strong>Livestream:</strong> 
        <!-- <a :href="band.livestream" target="_blank">Watch on YouTube</a> -->
        Available
      </p>
      <p v-else>No livestream available</p>
    </div>
  </div>
</template>

<style scoped>
.band-card {
  background-color: #333;
  padding: 15px;
  margin: 15px 0;
  border-radius: 8px;
  color: white;
  opacity: 0; /* Start hidden */
  transition: opacity 0.5s ease-in-out; /* Transition for fade-in */
}

.band-card.fade-in {
  opacity: 1; /* Fully visible when faded in */
}

.date-container {
  display: flex; /* Use flexbox for the container */
  align-items: center; /* Align items vertically in the center */
}

.circle-container {
  display: flex; /* Set to flex to allow horizontal alignment */
  flex-direction: column; /* Stack the circle and day of the week vertically */
  align-items: center; /* Center the circle */
  margin-right: 10px; /* Space between the circle and the month/year */
}

.circle-container-beside{
  display: flex; /* Set to flex to allow horizontal alignment */
  flex-direction: column; /* Stack the circle and day of the week vertically */
  align-items: center; /* Center the circle */
}

.date-circle {
  width: 50px; /* Adjust size as needed */
  height: 50px; /* Adjust size as needed */
  border-radius: 50%;
  background-color: #FFD700; /* Background color */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em; /* Adjust font size */
  font-weight: bold; /* Optional: make it bold for emphasis */
  margin-bottom: 5px; /* Space between the circle and the day of the week */
}

.month-year {
  margin-right: auto; /* Push this to the left */
  font-weight: bold; /* Optional: make it bold for emphasis */
  display: inline-block;
}

.month-year-padding{
  margin: 0; /* Remove margin for better alignment */
  font-weight: bold; /* Optional: make it bold for emphasis */
  font-size: 50%; /* Smaller size */
  visibility: hidden;
}

.day-of-week {
  margin: 0; /* Remove margin for better alignment */
  font-weight: bold; /* Optional: make it bold for emphasis */
  font-size: 50%; /* Smaller size */
  color: #FFD700; /* Gold color*/
}

.performance-date {
  font-size: 1.2em; /* Increase font size for visibility */
  font-weight: bold; /* Bold for emphasis */
}

.band-card h2 {
  color: #FFD700; /* Gold color for band names */
}

.band-image {
  /* max-width: 100%;
  height: auto; */
  max-width: 100vh;
  max-height: 20vh;
  border-radius: 8px;
  margin-bottom: 10px;
}
/* 
a {
  color: #1E90FF; /* Dodger blue color for links */


.video-container {
  position: relative; /* Allow absolutely positioned children to overflow */
  overflow: visible;  /* Ensure overflow is visible */
  width: auto; /* Adjust as needed */
  height: auto; /* Adjust as needed */
}

.video-iframe {
  position: absolute; /* Position the iframe absolutely */
  width: auto; /* Full viewport width */
  height: auto; /* Full viewport height */
}

</style>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
