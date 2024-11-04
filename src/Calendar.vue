
<template>
  <div class="nav-sticky"><a class="nav-link" href="../Calendar2">If you’re experiencing lag, click here for a better user experience.</a></div>
      <div class="container">
        <div class="overlay">
  <div class="slider" id = "slider" >


      <!-- </div> -->
    <div 
      class="slide" 
      v-for="(event, index) in sortUpcomingEvents" 
      :key="event.id" 
    >
      <div class="slide-img">
        <img :src="`../images/calendar/${event.bandName}_image1.png`" alt="Band Image" />
      </div>
      <div class="slide-text  landscape-mode">
        <h1 class = "color-1">{{ event.bandName }}</h1>
        <p class = "color-2">&#x1F4C5;{{ formatShortDate(event.performanceStart)}} <span v-if="shouldDisplayEndDate(event)"> - {{ formatShortDate(event.performanceEnd) }}</span>
         </p>
        <p class = "color-2">&#x1F553; {{ formatTime(event.performanceStart)}} - {{ formatTime(event.performanceEnd)}}</p>
        <p class = "color-2">&#x1F4CD; {{ event.location }} </p>
        <p class = "color-2" >&#x1F4FA; Livestream? <span v-if="event.livestream  !== '' "> &#x2705;</span><span v-else>&#x274C;</span> </p>
        
      </div>
    </div> 


    <div class="slide slide-class-video">
    <div v-if="availableLivestreams.length > 0">
      <div class = "slide-header-text">
        <div class = "color-1">{{ availableLivestreams[0].bandName }}</div>
        <div class = "color-2">      Live Now till 
      <span v-if="shouldDisplayEndDate(availableLivestreams[0])"> {{ formatShortDate(availableLivestreams[0].performanceEnd) }}</span>
      {{ formatTime(availableLivestreams[0].performanceEnd) }}
      <p>@ {{ availableLivestreams[0].location }}</p></div>

    </div>

<div class = "slide-video" >       
  <div class="iframe-wrapper">
    <iframe
      ref="livestreamVideo"
      :src="availableLivestreams[0].livestream.replace('watch?v=', 'embed/') + '?autoplay=1&mute=0'"
      class="responsive-iframe"
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen
      @load="setVideoDivDimensions"
    ></iframe>
  </div>
    </div>
  </div> 
  <div v-else>
    <div class = "slide-header-text color-1">No Live Streams Available</div>
    </div>
    <div class = "slide-header-text">
      
    <div class = "color-2">Scroll to see upcoming events</div>
  </div>

</div> 
 
</div>
</div>
</div>
</template>

<script>

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
//import './src/CalendarJS.js'; // Make sure the path is correct


import { ref, onMounted, computed } from 'vue'; // Import onMounted for lifecycle hook
import { db } from '../firebaseConfig.js'; // Adjust the import path according to your project
import { collection, onSnapshot } from 'firebase/firestore'; // Import onSnapshot
import { nextTick } from 'vue'; // Import nextTick
import {  watch } from 'vue'; 
//import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);




// Define shaders scripts as string constants since vue.js can only have max of 1 script
const vertexShader = `
    void main() {
        gl_Position = vec4(position, 1.0);
    }
`;


// linear-gradient(135deg, rgba(32, 1, 43, 0.85), rgba(10, 0, 20, 0.9))
// vec3 color1 = vec3(0.396, 0.0, 0.639); // Dark purple
// vec3 color2 = vec3(0.435, 0.0, 0.91);   // darker purple

// vec3 color1 = vec3(0.125, 0.004, 0.169); // Dark purple
// vec3 color2 = vec3(0.039, 0.0, 0.078);   // darker purple


const fragmentShader = `
    uniform vec2 iResolution;
    uniform float iTime;
    uniform float scrollOffset;

    // Function to map values to a neon purple and neon blue gradient with a black center
    vec3 getColor(float value) {
        // Normalize the value to a 0-1 range for blending
        float normalizedValue = (value + 1.0) / 2.0; // Assuming value ranges from -1 to 1
        
        // Define colors
        vec3 color1 = vec3(0.161,0.,0.231); // Dark purple
        vec3 color2 = vec3(0.09,0.,0.129);   // darker purple
        
        // Define the color blend logic
        if (abs(value) < 0.2) {
            return vec3(0.0, 0.0, 0.0); // Black in the center
        } else {
            // Blend colors based on the distance from the center
            return mix(color1, color2, normalizedValue);
        }
    }

    void mainImage(out vec4 o, vec2 I) {
        I -= o.zw = iResolution.xy / 2.0; // Center the coordinates
        float t = iTime * 5.0 + scrollOffset * 200.0;
        float pattern = sin(atan(I.y, I.x) / 0.1) * sin(20.0 * (o.w /= length(I)) + t) - 1.0 + o.w;

        // Map the pattern value to a color
        vec3 color = getColor(pattern);
        o = vec4(color, 1.0);  // Set the final output color
    }

    void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
`;






export default {
setup() {
  const calendarData = ref([]); // Reactive calendar data
  const availableLivestreams = ref([]); // Reactive for available livestreams
  
  // const sortUpcomingEvents = [];

  // const uniforms = {
  //     scrollOffset: { value: 0 }, // Initialize scrollOffset
  //   };
  var uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    scrollOffset: { value: 0 },
  };
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

  const getInitialTranslateZ = (slide) => {
      return gsap.getProperty(slide, "z");
    };

  const mapRange = (value, inMin, inMax, outMin, outMax) => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
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
  //const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }) // Short day of the week

  return `${day} ${month} ${year}`; // Return the formatted date string
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

  // console.log(`Start Date: ${startDate}`);
  // console.log(`End Date: ${endDate}`);
  // console.log(`Cutoff Time: ${cutoffTime}`);
  // console.log(`isSameDay: ${isSameDay}`);
  // console.log(`Should display end date? ${!isSameDay && (endDate > cutoffTime)}`);

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



// Example usage










  onMounted(() => {

  // Background Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('slider').appendChild(renderer.domElement); 

  const geometry = new THREE.PlaneGeometry(2, 2);

      const material = new THREE.ShaderMaterial({
        uniforms: uniforms, 
        vertexShader: vertexShader, 
        fragmentShader: fragmentShader,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      let lastTime = 0;
      function animateTunnel(time) {
        const deltaTime = time - lastTime;
        lastTime = time;  
        uniforms.iTime.value += deltaTime * 0.0005;

        renderer.render(scene, camera);
        requestAnimationFrame(animateTunnel);
      }
      animateTunnel(0);

      window.addEventListener("resize", () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        uniforms.iResolution.value.set(width, height);
        // console.log("UNIFORMS:" , uniforms.iResolution.value)
        setupSlides(); // Call setupSlides on dimension change
      });
    

    fetchCalendarData(); // Call the fetch function when the component is mounted

  });

    // Watch for changes in calendarData
    watch(calendarData, async () => {
  try {
    await nextTick(); // Wait for DOM updates
    console.log('Calendar Data Updated:', calendarData.value);
    
    console.log('Calendar sort upcoming events:', sortUpcomingEvents);

    updateAvailableLivestreams(); // Update available livestreams on calendar data change
    setupSlides(); // Call setupSlides when calendarData changes


    //This scroll triggers the animation speed of the background
    ScrollTrigger.create({
        trigger: ".container",
        start: "top top",
        //markers: true, //For debugging
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
            uniforms.scrollOffset.value = self.progress*3;
        }
    });

    //Add scroll trigger to all the .slide, so that it can be displayed and rendered according to the zposition / scroll
    const slides = document.querySelectorAll('.slider .slide'); // Select all slide elements within the slider
    const totalSlides = slides.length;
    console.log("TOTAL SLIDES",totalSlides)
    Array.from(slides).forEach((slide, index) => {
      var initialZ = getInitialTranslateZ(slide)

      ScrollTrigger.create({
          trigger: ".container",
          start: "top top",
          end: "bottom bottom",
          markers: false, 
          scrub: 1,

            
          onUpdate: (self) => {
              const progress = self.progress;
              const zIncrement = progress * zStep * (totalSlides-1); //This controlls total scroll length 
              const currentZ = initialZ + zIncrement;

              let opacity;

              if (currentZ >= -zStep){
                  opacity = mapRange(currentZ,-zStep,0,0,1);
              } else {
                  opacity = mapRange(currentZ,-2*zStep,-zStep,0,0);
              }
              slide.style.opacity = opacity;
              slide.style.transform = `translateX(-50%) translateY(-50%) translateZ(${currentZ}px)`;
      }})});

  } catch (error) {
    console.error('Error in watcher:', error);
  }
});



// Setting initial slides positions
const zStep = 2500; // Distance between images
  function setupSlides() {




        const slides = document.querySelectorAll('.slider .slide'); // Select all slide elements within the slider
          console.log("RAN setup SLIDES")
          const totalSlides = slides.length;
          // const totalSlides = sortUpcomingEvents.value.length;
          console.log("TOTAL SLIDES2 ",totalSlides)

          const initialZ = -(totalSlides-1)*zStep

          const calculatedHeight = -(initialZ)/2 ; //Divided by 2 for faster scrolling
          const container = document.getElementsByClassName("container")[0];
          console.log(container)
          container.style.height = `${calculatedHeight}px`;
         slides.forEach((slide, i) => {

        const zPosition = initialZ + (i * zStep);
        
        const opacity = i === totalSlides -1 ? 1 : i === totalSlides - 2 ? 0.1 : 0;
        //const opacity = i === totalSlides - 1 ? 1 : i === totalSlides - 2 ? 0.1 : 0;
        //const opacity = 0;
        


        
        
         // Get the first child of each slide ('.slide-img')
        const firstChild = slide.firstElementChild;
        var xPosition = i % 2 === 0 ? "-70%" : "70%";

        // Get the second child of each slide ('.slide-text')
        const secondChild = slide.children[1];
        var xPosition2 = i % 2 === 0 ? "70%" : "-70%";
        
        var xPosition3 = "50%";

        //Added these code to account for iphone or potrait mode 
        const isPortrait = window.innerHeight > window.innerWidth;
        if (isPortrait) {
         xPosition = "0%";
         xPosition2 = "0%";
         xPosition3 = "105%";
        }
        

        gsap.set(slide, {
          top: "50%",
          left: "50%",
          xPercent: -50,
          yPercent: -50,
          z: zPosition,
          opacity: opacity,
        });

        gsap.set(firstChild, {
          left: xPosition,
        });

        gsap.set(secondChild, {
          left: xPosition2,
          top: xPosition3,
          
        });


      });
    }




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



};
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}



canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;  
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}


.color-1 {
    font-size: 50px;
    color: #ff00ff;
    font-weight: bold;

}

.color-2 {
    font-size: 30px;
    color: white;
}

  

h1 {
    color: black;
    font-size: 50px;
    font-weight: 500;
}

nav, footer{
    position: fixed;
    width: 100%;
    padding: 2em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    mix-blend-mode: exclusion;
    z-index: 2;

}

nav {
    top: 0;
}

footer {
    bottom: 0;
}

nav > div{
    flex: 1;
    display: flex;
    gap: 2em;
}

.logo {
    display: flex;
    justify-content: center;
}

.logo a{
    font-size: 48px;
    font-weight: lighter;
}

.nav-items:nth-child(3){
    justify-content: flex-end;
}


.container {
    width: 100%;
    /* height: 2000vh; */
    /* height: 100vh; */
    overflow-y: auto; /* Allow vertical scrolling */
}

.slider{
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    transform-style: preserve-3d;
    perspective: 500px;
    overflow: hidden;
    z-index: 3;
    opacity: 1;
}


.slide{
    position: absolute;
    width: 400px;
    height: 500px;
    will-change: transform, opacity;
    /* added this:  */
    transform-style: preserve-3d; /* Ensure 3D transformations are applied */
}

.slide-img{
    width: 100%;
    height: 100%;
    padding: 0.5em;
    background-color: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    backdrop-filter: blur(20px); 
    position: relative
}


.slide-text {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    background-color: #3d004d;;
    box-shadow: 0 8px 32px 0 rgba(76, 0, 153, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 10%
  }

.slide.slide-class-video{
    display: block;
    justify-content: center;
    align-items: center;
    height: auto; /* Fixed height */
    width: auto; /* Full width of the container */
    background-color: #3d004d;;
    box-shadow: 0 8px 32px 0 rgba(76, 0, 153, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 2%;
  }

  .slide-video {
    display: flex;
    justify-content: center;
    align-items: center;
    height: auto; /* Allow height to adjust */
    width: 100%; /* Full width of the container */
    margin: 5% 0; /* Top and bottom margin */
}

.iframe-wrapper {
    width: 100%; /* Full width */
    height: 0; /* Set height to 0 for the aspect ratio trick */
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    position: relative; /* Positioning context for absolute child */
    overflow: hidden; /* Hide overflow */
}

.responsive-iframe {
    position: absolute; /* Positioning the iframe */
    top: 0; /* Align to top */
    left: 0; /* Align to left */
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    object-fit: cover; /* Keep the aspect ratio without distortion */
}

/* For smaller screens, allow the iframe to resize */
@media (max-width: 800px) {
    .slide-video {
        width: 80vw; /* Allow width to adjust based on viewport */
        margin: 5% auto; /* Center the video with auto margins */
    }

    .iframe-wrapper {
        padding-bottom: 56.25%; /* Maintain aspect ratio */
    }

    .responsive-iframe {
        min-width: 300px; /* Minimum width for small screens */
        max-width: 100%; /* Allow full width */
    }
}

  

  .slide-header-text{
    width: auto;
    text-align: center;
}





.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 10vw;
    height: 100vh;
    background: black;
    background: radial-gradient(circle,
    rgba(0,0,0,0)60%,
    rgba(0,0,0,1)100%
    
    );

}

.lenis.lenis-smooth{
    scroll-behavior: auto !important;
}

.lenis.lenis-smooth[data-lenis-prevent]{
    overscroll-behavior: contain;
}

.lenis.lenis-stopped{
    overflow: hidden;
}

.lenis.lenis-smooth iframe{
    pointer-events: none;
}

.nav-sticky{
  color:white;
  z-index: 100000000; 
  position: fixed;
  top: 80px;
  text-align: center;
  width: 100%; /* Ensure full width */
}

</style>
