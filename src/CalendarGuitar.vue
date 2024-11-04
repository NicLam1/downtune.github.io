<script>
import { experimentalSetDeliveryMetricsExportedToBigQueryEnabled } from 'firebase/messaging/sw';
import { ref, onMounted, computed, watch, nextTick, onBeforeUnmount } from 'vue'; // Import onMounted for lifecycle hook
import { db } from '../firebaseConfig.js'; // Adjust the import path according to your project
import { collection, onSnapshot } from 'firebase/firestore'; // Import onSnapshot

export default {
  setup() {
  const calendarData = ref([]); // Reactive calendar data
  const availableLivestreams = ref([]); // Reactive for available livestreams
  const observer = ref(null); // Ref to store the IntersectionObserver
  
  // Fetch data with real-time listener
  const fetchCalendarData = () => {
    console.log("Running fetchdata")
    const calendarRef = collection(db, "calendar");
    onSnapshot(calendarRef, (querySnapshot) => {
      calendarData.value = []; // Clear previous data
      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        calendarData.value.push({
          id: doc.id, // Use document ID as the unique key
          bandName: eventData.bandName,
          location: eventData.location,
          livestream: eventData.livestream,
          performanceStart: eventData.performanceStart,
          performanceEnd: eventData.performanceEnd,
          
        });
      });
      console.log('Fetched Calendar Data:', calendarData.value);
    });
  };

//Use first one for actual date, else use below for debugging
const today = new Date();
// Set a specific date and time for debugging
//const today = new Date('2024-10-27T20:00:00+08:00');
//const today = new Date('2024-09-27T20:00:00+08:00');


// Define a computed property for sorted upcoming events
const sortUpcomingEvents = computed(() => {
  return calendarData.value
    .filter(event => {
      // Convert performanceStart to a Date object for comparison
      const performanceDate = new Date(event.performanceStart);
      return performanceDate > today; // Only include events after today
    })
    .sort((a, b) => {
      // Sort by performanceStart in ascending order (furthest date first)
      return new Date(b.performanceStart) - new Date(a.performanceStart);
    });
});


// Format date function
const formatShortDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for the day
  const month = date.toLocaleString('default', { month: 'short' }); // Short month name 
  const year = date.getFullYear();
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }) // Short day of the week
  const shortdate = day + " " + month + " " + year

  return { date, day, month, year, dayOfWeek, shortdate };  // Return the formatted date string
};

// Format time function
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

// Method to determine if the end date should be displayed
const shouldDisplayEndDate = (event) => {
  const startDate = new Date(event.performanceStart);
  const endDate = new Date(event.performanceEnd);

  // Check if the start and end dates are the same
  const isSameDay = startDate.toDateString() === endDate.toDateString();

  // Define the cutoff time (12 PM on the day after the start date)
  const cutoffTime = new Date(startDate);
  cutoffTime.setDate(startDate.getDate() + 1);
  cutoffTime.setHours(12, 0, 0, 0); // Set to 12 PM

  // Determine if we should display the end date
  return !isSameDay && (endDate > cutoffTime);
};

// Method to find available livestreams as of today
const updateAvailableLivestreams = () => {
      availableLivestreams.value = calendarData.value
        .filter(event => {
          const performanceStart = new Date(event.performanceStart);
          const performanceEnd = new Date(event.performanceEnd);
          return today >= performanceStart && today <= performanceEnd && event.livestream !== "";
        })
        .sort((a, b) => new Date(a.performanceStart) - new Date(b.performanceStart));
    };

    // Initialize the IntersectionObserver
    const initObserver = () => {
      observer.value = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            fadeIn(entry.target); // Call fadeIn method when the element is in view
          }
        });
      });

      // Select what items to observe for the fade-in effect
      const bandCards = document.querySelectorAll('.fade-element'); 
      bandCards.forEach(card => {
        observer.value.observe(card);
      });
    };

    // Fade-in effect implementation
    const fadeIn = (element) => {
      element.classList.add('fade-in'); // Add a class for your fade-in effect
    };

    // Cleanup observer on unmount
    const disconnectObserver = () => {
      if (observer.value) {
        observer.value.disconnect();
      }
    };

  onMounted(() => {
    fetchCalendarData(); // Call the fetch function when the component is mounted
  });

    // Watch for changes in calendarData
    watch(calendarData, async () => {
  try {
    await nextTick(); // Wait for DOM updates
    console.log('Calendar Data Updated:', calendarData.value);
    
    console.log('Calendar sort upcoming events:', sortUpcomingEvents);

    updateAvailableLivestreams(); // Update available livestreams on calendar data change
    initObserver() 

  } catch (error) {
    console.error('Error in watcher:', error);
  }
});
onBeforeUnmount(() => {
      disconnectObserver(); // Cleanup observer
    });

// Setting initial slides positions

  return {
    calendarData,
    sortUpcomingEvents,
    formatShortDate,
    formatTime,
    shouldDisplayEndDate,
    availableLivestreams,
    today,
    debugData() {
      console.log('Fetched Calendar Data:', calendarData.value);
      console.log('Upcoming E',sortUpcomingEvents);
    },
    
  };


  
},


  computed: {
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

 };
      }
    },
   
    // initObserver() {
    //   this.observer = new IntersectionObserver((entries) => {
    //     entries.forEach(this.fadeIn);
    //   });

    //   //Select what items add observer for fadein effect
    //   const bandCards = document.querySelectorAll('.fade-element'); 
    //   bandCards.forEach(card => {
    //     this.observer.observe(card);
    //   });
    // },
    disconnectObserver() {
      if (this.observer) {
        this.observer.disconnect(); // Clean up observer
      }
    },
  },
  mounted() {
    // this.initObserver();
  },
  beforeUnmount() {
    this.disconnectObserver();
  }
};
</script>


<template>
  <div class = "bg-container">
  <div class="bg-container-start"></div>
  <div id = "miniapp">
    
      <h1>Calendar & Live Stream</h1>
  <div>
    <!-- Livestream Section -->

    <!-- <pre>{{ currentLivestream }}</pre>  -->
    <!-- //debugging ^^^ instead of using console.log -->
    <div class="video-container" v-if="availableLivestreams.length > 0">
      <div class = "h3-blur">
        <div class = "color-1 headerbandname">{{ availableLivestreams[0].bandName }}</div>
        <div class = "color-2">      Live Now till 
      <span v-if="shouldDisplayEndDate(availableLivestreams[0])"> {{ formatShortDate(availableLivestreams[0].performanceEnd).shortdate }}</span>
      {{ formatTime(availableLivestreams[0].performanceEnd) }}
      <p>@ {{ availableLivestreams[0].location }}</p></div>
      </div>
      <div class="iframe-wrapper">
      <iframe 
        :src="availableLivestreams[0].livestream.replace('watch?v=', 'embed/') + '?autoplay=1&mute=0'"
         
        class="responsive-iframe"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
    </div>
    </div>
    <div v-else class = "nolivestreamclass">
    <div class = "slide-header-text color-1">No Live Streams Available</div>
    
    <div class = "slide-header-text">
      
    <div class = "color-2">Scroll to see upcoming events</div>
  </div>
</div>
  </div>
 
<h3 class = "h3-blur">Upcoming events:</h3>
<div id = "band-cards-id">
    <div v-for="(event,index) in sortUpcomingEvents" >
      <div class = "animation-and-card-border">
      <div v-if="index !== 0" class = "animation-border">
      <div class = "coloring"></div>
      <!-- <img class="gif1" src="../images/white-flame-on-appear.gif" alt="Your First GIF" style="opacity: 1; "> 
      <img class="gif2" src="../images/white-flame-after-appear.gif" alt="Your Second GIF" style="opacity: 0; width: 750px "> 
       -->
      </div>
      <div class = "band-card-parent-border">
      <div class = "band-card fade-element" >
      <div class = "band-card-blur">
      <div class="date-container">
        <div class="circle-container">
          <div class="date-circle">{{ formatShortDate(event.performanceStart).day}}</div>
          <p class="day-of-week">{{ formatShortDate(event.performanceStart).dayOfWeek}}</p>
        </div>
        <div class="circle-container-beside">
          <p class="month-year">{{ formatShortDate(event.performanceStart).month}} {{ formatShortDate(event.performanceStart).year}}
            <span v-if="shouldDisplayEndDate(event)"> - {{ formatShortDate(event.performanceEnd).shortdate }}</span>
            
          </p>
        </div>
      </div>

      <h2>{{ event.bandName }}</h2>
      <img :src="`./src/assets/Band/${event.bandName}_image1.png`" :alt="event.bandName" class="band-image" />
      <p class = "color-2">&#x1F553; {{ formatTime(event.performanceStart)}} - {{ formatTime(event.performanceEnd)}}</p>
      <p class = "color-2">&#x1F4CD; {{ event.location }} </p>
      <p class = "color-2" >&#x1F4FA; Livestream? <span v-if="event.livestream  !== '' "> &#x2705;</span><span v-else>&#x274C;</span> </p>
 
    </div>
  </div>
</div>
</div>
</div>  
</div>
</div>
<div class="bg-container-end fade-element"></div>
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
  background-color: #ff00ff; /* Background color */
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
  color: white; /* Gold color*/
}

.performance-date {
  font-size: 1.2em; /* Increase font size for visibility */
  font-weight: bold; /* Bold for emphasis */
}

.band-card h2 {
  color: #ff00ff; /* Gold color for band names */
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
  position: relative;
  z-index: 100;
}

.h3-blur-nolive {
  /* background-color: #333; */
  background-color: rgba(0, 0, 0, 0.7);
  
  padding: 100px 0;
  margin: 180px 0 50px 0;
  border-radius: 8px;
  
  
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

body {
      background-color: black;
      color: white;
      margin: 0px 0px 0px 0px;
      padding: 0px;
      position: relative; /* Ensure body is the reference for :before */
      left: 0px;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      
    }

    #miniapp {
      max-width: 400px; 
      /* edited this ^ */
      margin: 0 auto;
      padding: 0 2rem;
      text-align: center;
      
    }

    .bg-container {
      background: linear-gradient(to right, #240244, #100014);
    }



    .bg-container-start {
  background-image: url('../images/wallpaperstart.png');
  background-position: top center;
  background-repeat: no-repeat;
  background-size: 2600px auto; /* Set specific background size */
  width: 100%; /* Constrain width to the available space */
  min-height: 2400px;
  padding-top: 0;
  position: absolute;
  top: -110px;
  left: 0;
  margin: 20px 0 0 0 ;
  box-sizing: border-box; /* Include padding/borders in width */
  
}


.bg-container-end {
  background-image: url('../images/wallpaperend.png'); /* Replace with your image path */
  background-position: top center; /* Aligns the image to the top center */
  background-repeat: no-repeat;
  background-size: 1300px auto; /* Set specific background size */
  width: 100%; /* Constrain width to the available space */
  min-height: 1800px; /* Ensure it has a minimum height */
  padding-top: 0; /* No padding on top */
  margin: -20px 0 0 0; /* Adjust margin-top to move it up */
  position: relative; /* Use relative positioning */
  box-sizing: border-box; /* Include padding/borders in width */

  opacity: 0; /* Start hidden */
  transition: opacity 2s ease-in-out; /* Transition for fade-in */
}

    .fade-in {
      opacity: 1; /* Fully visible when faded in */
    }

    h1 {
      font-size: x-large;
    font-style: italic; /* Italic style */
    margin: 0;
    padding: 20px 0 0 0;
    text-align: center;
    color: #ffffff;
    text-shadow: 
        -1px -1px 0 #000000, /* black outline */
        1px -1px 0 #000000,
        -1px 1px 0 #000000,
        1px 1px 0 #000000;
    position: relative;
    z-index: 100;
    overflow: visible; /* Allow overflow to be visible */
    white-space: normal; /* Allow wrapping if necessary */
}


    .logo {
            display: block;
            max-width: 100px; /* Responsive image */
            height: auto; /* Maintain aspect ratio */
            border-radius: 10px; /* Optional: rounded corners */
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.5); /* Optional: shadow around the image */
            margin: 0 auto 0 auto; /* Center the image horizontally */

        }

        #band-cards-id{
          margin-left: -30px;
        }


.color-1 {
    color: #ff00ff;
    font-weight: bold;
}

.color-2 {
    color: white;
}

.headerbandname{
  font-size: 30px;
}

.nolivestreamclass{
  position: relative;
  margin: 160px 0 50px 0;
  padding: 80px 0px;
  border-radius: 8px;
  background-color: #000000;
}
.slide-header-text{
  font-size: x-large;
  z-index: 1000;
  text-shadow: -1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000, 1px 1px 0 #000000;
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
