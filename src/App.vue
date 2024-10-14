<script>
import { experimentalSetDeliveryMetricsExportedToBigQueryEnabled } from 'firebase/messaging/sw';

export default {
  data() {
    return {
      liveNowBoolean: false,
      bands: [
      {
          name: "The Sonic Waves",
          image: "./images/stock band/image1.jpg",
          performanceDate: "October 13, 2024",
          performanceTime: "3:30 PM",
          performanceEndTime: "5:00 PM",
          location: "Singapore",
          livestream: "https://www.youtube.com/watch?v=tRWWJ7iBLgc" 
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
       return new Date();


      // Set a specific date and time for debugging
      return new Date('2024-10-13T16:00:00+08:00');
      
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
        
        console.log("CLASSSSS")
        console.log(entry.target)

        //added this so that it will not affect the last one!!!
        console.log("LENNN")
        console.log(entry.target.parentElement.parentElement.getElementsByClassName("animation-border"))
        if (!entry.target.classList.contains('bg-container-end') && entry.target.parentElement.parentElement.getElementsByClassName("animation-border").length !== 0){

        setTimeout(() => {

                
                this.fadeGifs(entry.target.parentElement.parentElement);
                // console.log("entry target")
                // console.log(entry.target.parentElement.parentElement)
            }, 1000); };
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

      //Select what items add observer for fadein effect
      const bandCards = document.querySelectorAll('.fade-element'); 
      bandCards.forEach(card => {
        this.observer.observe(card);
      });
    },
    disconnectObserver() {
      if (this.observer) {
        this.observer.disconnect(); // Clean up observer
      }
    },
    fadeGifs(animationborderelement) {
      const gif1 = animationborderelement.getElementsByTagName('img')[0];
      const gif2 = animationborderelement.getElementsByTagName('img')[1];
      const colordiv = animationborderelement.getElementsByClassName('coloring')[0];
      console.log(animationborderelement)
      // Fade out the first GIF
      gif1.style.opacity = 0;

      console.log(animationborderelement)

      // After the fade-out transition, fade in the second GIF
      setTimeout(() => {
          gif2.style.opacity = 1;
          colordiv.style.opacity=1;
      }, 1000); // Wait for 1 second before fading in the second GIF

      console.log("gif faded")
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
      <div class = "h3-blur">
      <h3>Live Now till {{ currentLivestream.performanceEndTime }}: {{ currentLivestream.name }} </h3>
      <h3> @ {{ currentLivestream.location}}</h3>
      </div>
      <div class="iframe-wrapper">
      <iframe 
        :src="currentLivestream.livestream.replace('watch?v=', 'embed/') + '?autoplay=1&mute=0'"
         
        class="responsive-iframe"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
    </div>
    </div>
    <h3 v-else class = "h3-blur-nolive">{{ nextLivestreamMessage }}</h3>
  </div>
 
<h3 class = "h3-blur">Upcoming events:</h3>
    <div v-for="(band, index) in upcomingEvents" :key="index" >
      <div class = "animation-and-card-border">
      <div v-if="index !== 0" class = "animation-border">
      <div class = "coloring"></div>
      <img class="gif1" src="../images/white-flame-on-appear.gif" alt="Your First GIF" style="opacity: 1; "> 
      <img class="gif2" src="../images/white-flame-after-appear.gif" alt="Your Second GIF" style="opacity: 0; width: 750px "> 
      
      </div>
      <div class = "band-card-parent-border">
      <div class = "band-card fade-element" >
      <div class = "band-card-blur">
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
</div>
</div>
  </div>
</template>

<style scoped>
.band-card {
  /* background-color: #333; */
  background-image: url('../images/background-mid.png');
  
  border-radius: 8px;
  color: white;
  position: relative;
  z-index: 2; /* Higher z-index to place above animation-border */
  width: 400px;
  
}

.band-card-blur {
  /* background-color: #333; */
  background-color: rgba(0, 0, 0, 0.7);
  

  border-radius: 8px;  
  padding: 15px;

  
  
}

.fade-element{
  opacity: 0; /* Start hidden */
  transition: opacity 2s ease-in-out; /* Transition for fade-in */
  
}


.fade-in {
  opacity: 1; /* Fully visible when faded in */
}

.date-container {
  padding-top: 22px;
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
  background-color: #ffb300; /* Background color */
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
  color: #ffb300; /* Gold color*/
}

.performance-date {
  font-size: 1.2em; /* Increase font size for visibility */
  font-weight: bold; /* Bold for emphasis */
}

.band-card h2 {
  color: #ffb300; /* Gold color for band names */
}

.band-image {
  /* max-width: 100%;
  height: auto; */
  max-width: 360px;
  max-height: 20vh;
  border-radius: 8px;
  margin-bottom: 10px;
  z-index: 5; /* higher z-index to place in front  band-card */

}
/* 
a {
  color: #1E90FF; /* Dodger blue color for links */


.video-container {
  position: relative; 
  /* Establish positioning context */ 
  /*  Allow overflow */
  overflow: visible;
  /* padding: 0px; Optional padding */
  padding-bottom: 30px;
}

.iframe-wrapper {
  position: relative; /* Establish positioning for the iframe */
  /* width: 100%; Full width of the parent */
  /* height: 50vh; Set height as desired */
  /* width: 600px; */
  height: 300px;
  width: auto;
  overflow: visible; /* Allow overflow */
}


.responsive-iframe {
  position: absolute; /* Position absolutely within the wrapper */
  top: 0; /* Align to the top */
  left: 50%; /* Align to the left */
  transform: translateX(-50%); /* Center the iframe */
  width: 130%; /* Full viewport width */
  height: 100%; /* Full height of the wrapper */
  border: none; /* Remove border */
}
/* Remove this later^ */

h3{
  color:rgb(255, 255, 255);
  text-shadow: 
        -1px -1px 0 #000000, /* white outline */
        1px -1px 0 #000000,
        -1px 1px 0 #000000,
        1px 1px 0 #000000;

}

.h3-blur {
  /* background-color: #333; */
  background-color: rgba(0, 0, 0, 0.7);
  
  padding: 5px;
  margin: 15px 0;
  border-radius: 8px;
}

.h3-blur-nolive {
  /* background-color: #333; */
  background-color: rgba(0, 0, 0, 0.7);
  
  padding: 100px 0;
  margin: 180px 0 50px 0;
  border-radius: 8px;
  
  
}


.gif1, .gif2{
  height: 99%; /* Keep height full to maintain aspect ratio */
  width: auto;
  position: absolute; /* Changed to absolute */
  top: 50%; /* Move the top to the center vertically */
  left: 50%; /* Move the left to the center horizontally */
  padding-left: 400px;

  transform: translate(-50%, -50%); /* Adjust the position to center both images */
  transition: opacity 1s ease-in-out; /* Fade transition */

  
}

.animation-border{
  position: relative; /* Create a positioning context for absolute children */
  width: 400px; /* Set the width as needed */
  height: inherit; /* Set height as needed */
  z-index: 1; /* Lower z-index to place behind band-card */

}

.animation-and-card-border {
  margin: 15px 0; 
  display: flex;

}

.coloring {
  content: '';
  position: absolute;

  background: linear-gradient(to bottom, red, orange, yellow, green, blue, indigo, violet);
  mix-blend-mode: color;
  pointer-events: none;
  z-index: 1; /* Ensure the gradient covers the video */
  height: 98.5%; /* Keep height full to maintain aspect ratio */
  width: 740px;
  position: absolute; /* Changed to absolute */
  top: 50%; /* Move the top to the center vertically */
  left: 50%; /* Move the left to the center horizontally */
  margin-left: 200px;
  transform: translate(-50%, -50%); /* Adjust the position to center both images */
  opacity: 0; /* Start hidden */
  transition: opacity 5s ease-in-out; /* Transition for fade-in */
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
