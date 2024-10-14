import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')


// rainbow cursor
document.addEventListener('mousemove', createImageTrail);

function createImageTrail(e) {
    console.log("EEEEEEEEEEEEE")
    console.log(e)
  const trail = document.createElement('span');
  trail.classList.add('image-trail');

  // Set the position of the trail to follow the cursor
  trail.style.left = `${e.pageX - 25}px`; // Center the image
  trail.style.top = `${e.pageY - 5}px`;  // Center the image

  // Generate a random color for the filter (hue rotation)
  const hue = Math.floor(Math.random() * 360);
  trail.style.filter = `hue-rotate(${hue}deg)`; // Apply hue rotation to the image

  document.body.appendChild(trail);
  

  // Remove the trail after the animation finishes
  setTimeout(() => {
    trail.remove();
  }, 400); // Match this with the animation duration
}

document.addEventListener('DOMContentLoaded', function () {
    var timer; // To hold the timer
    var interval; // To hold the interval
    var delay = 200; // Delay in milliseconds

    // Event listener for mouse movement
    document.addEventListener('mousemove', function (e) {
        console.log("Mouse moved"); // Log when the mouse moves
        console.log(e); // Log the event object

        // If an interval is already running, clear it
        if (interval) {
            clearInterval(interval);
            interval = null; // Reset interval
        }

        // If the timer is already set, clear it
        if (timer) {
            clearTimeout(timer);
        }

        // Set a new timer that will start the interval after the specified delay
        timer = setTimeout(function() {
            // Start an interval to call createImageTrail every 500ms
            interval = setInterval(function() {
                createImageTrail(e); // Call the function with the event object
            }, delay);
        }, delay);
    });
});
