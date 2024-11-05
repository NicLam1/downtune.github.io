<template>
  <div class="form-container" :style="{ background: backgroundGradient }">
    <div class="welcome-container text-center">
      <div v-motion :initial="{ opacity: 0, y: 0 }" :enter="{ opacity: 1, y: 0 }" :delay="200" :duration="1500">
        <h1 class="welcome-text">Welcome to Downtune</h1>
      </div>
      <div v-motion :initial="{ opacity: 0, y: 0 }" :enter="{ opacity: 1, y: 0 }" :delay="1700" :duration="1500">
        <h3>We want to get to know you</h3>
      </div>
      <div v-if="showArrow" v-motion :initial="{ opacity: 0, y: 0 }" :enter="{
        opacity: 0.5, y: 100, transition: {
          repeat: 2,
        }
      }" :delay="3000" :duration="2000" class="scroll-arrow">
        <i class="fa fa-arrow-down"></i>
      </div>
    </div>
    <Carousel @updateBackgroundGradient="setBackgroundGradient" @selectedGenres="updateGenres"></Carousel>
    <MotionGroup preset="slideVisibleLeft" :duration="600">
      <OtherQuestions v-for="(question, index) in questions" :key="index" :title="question.title"
        :options="question.options" :link="question.link" :background="backgroundGradient" :questionIndex="index"
        @selectedOption="updateResponse">
      </OtherQuestions>
    </MotionGroup>
    <button class="btn btn-success submit-responses" @click="submitResponses">Submit</button>

    <div class="playBut">
      <p v-if="showPlayText" class="play-text">Play Me</p>
      <img id="icon" src="./bandLoginImg/play.png" style="cursor: pointer;" @click="togglePlay()">
      <div class="soundWaves">
        <div class="line" v-for="n in 10" :key="n"></div>
      </div>
    </div>

    <audio id="mySong" src="/The Weeknd - Less Than Zero (Instrumental).mp3" loop></audio>

    <footer style="font-size: 10px;">
      Guitar Amp by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza
      (https://poly.pizza/m/3FiWjHDj0Zf)<br>
      "Grand Piano" (https://skfb.ly/U87o) by farhad.Guli is licensed under Creative Commons Attribution
      (http://creativecommons.org/licenses/by/4.0/).<br>
      "Electric Guitar" (https://skfb.ly/6nFJX) by haerades is licensed under Creative Commons Attribution-NonCommercial
      (http://creativecommons.org/licenses/by-nc/4.0/).<br>
      DJ gear by Poly by Google [CC-BY] via Poly Pizza<br>
    </footer>
  </div>
</template>

<script>
import { db } from '../firebaseConfig.js';
import { collection, doc, setDoc } from "firebase/firestore";

import Carousel from './Carousel.vue';
import OtherQuestions from './questionComponent.vue';

export default {
  components: {
    Carousel,
    OtherQuestions,
  },
  data() {
    return {
      backgroundGradient: 'linear-gradient(135deg, forestgreen, darkseagreen)',
      showArrow: true,
      showPlayText: true,
      questions: [
        { title: 'What type of event are you planning?', options: ['Corporate', 'Wedding', 'Party', 'Festival', 'Others'], link: '/Guitar_Amp.glb' },
        { title: 'What is your budget for live music?', options: ['$400-$600 per hour', '$600-$1000 per hour', '$1000-$1400 per hour', '$1500+ per hour'], link: '/Piano.glb' },
        { title: 'How long is the event?', options: ['Less than 6 hours', '6 to 12 hours', 'Multi-Day event'], link: '/Electric_guitar.glb' },
        { title: 'My event is...', options: ['Indoors', 'Outdoors'], link: '/DJ_gear.glb' }
      ],
      responses: {},
      genres: [],
    };
  },
  mounted() {
    setTimeout(() => {
      this.showArrow = false;
    }, 6500);
  },
  methods: {

    setBackgroundGradient(gradient) {
      this.backgroundGradient = gradient; // Update the parent background
    },
    updateResponse({ questionIndex, selectedOption }) {
      this.responses[questionIndex] = selectedOption;
    },
    submitResponses() {
      console.log(this.responses);
      console.log(this.genres);
      const userId = "user123"; // Replace with actual user ID
      const preferences = {
        genres: this.genres,
        eventType: this.responses[0],
        budget: this.responses[1],
        eventDuration: this.responses[2],
        eventLocation: this.responses[3],
      };

      // Save preferences directly to Firestore using the modular syntax
      setDoc(doc(collection(db, "bandPreferences"), userId), preferences)
        .then(() => {
          console.log("User preferences saved successfully!");
        })
        .catch(error => {
          console.error("Error saving preferences:", error);
        });

      this.$router.push('/');
    },
    updateGenres(genres) {
      this.genres = genres;
    },

    // play/pause music

    togglePlay() {
      const mySong = document.getElementById("mySong");
      const icon = document.getElementById("icon");
      const lines = document.querySelectorAll(".line");

      if (mySong.paused) {
        console.log("togglePlay called"); // Check if function is triggered
        mySong.play();
        icon.src = "/img2/pause.png";
        this.showPlayText = false; // Hide text when playing
        lines.forEach((line) => {
          line.classList.add("active");
          const animation = this.getRandomAnimation();
          const duration = this.getRandomDuration();
          const delay = Math.random().toFixed(2);
          line.style.animation = `${animation} ${duration}s ease-in-out ${delay}s infinite`;
        });
      } else {
        mySong.pause();
        icon.src = "/img2/play.png";
        this.showPlayText = true; // Show text when paused
        lines.forEach((line) => {
          line.classList.remove("active");
          line.style.animation = "none";
        });
      }
    },

    // wavesss

    getRandomAnimation() {
      const animations = ['waveMotion1', 'waveMotion2', 'waveMotion3', 'waveMotion4', 'waveMotion5'];
      return animations[Math.floor(Math.random() * animations.length)];
    },
    getRandomDuration() {
      return (Math.random() * 0.5 + 0.7).toFixed(2);
    }
  }

};
</script>

<style></style>


<style scoped>
.welcome-container {
  height: 95vh;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.welcome-text {
  font-size: 80px;
}

.scroll-arrow {
  font-size: 4rem;
  color: #333;
  margin-top: 2rem;
  position: absolute;
  bottom: 20px;

}

.submit-responses {
  border: none;
  outline: none;
  padding: 10px;
  border-radius: 10px;
  color: #fff;
  font-size: 24px;
  transform: 0.3s ease;
  background-color: #00bfff;
  display: block;
  margin: 20px auto;
}

.submit-responses:hover {
  background-color: #00bfff96;
}

/* play butt */
.playBut {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  top: 620px;
  right: 100px;
  z-index: 4;
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.playBut p {
  margin-right: 10px;
}

img {
  width: 80px;
}

#icon {
  cursor: pointer;
}

.play-text {
  font-size: 20px;
  color: blueviolet;
  margin-bottom: 5px;
  text-align: center;
  font-weight: bold;
}


/* wave */

.soundWaves {
  display: flex;
  align-items: flex-end;
  height: 50px;
  margin-left: 10px;
  z-index: 4;


}

.line {
  width: 12px;
  background-color: grey;
  margin-right: 2px;
  transition: height 0.2s ease;
  opacity: 0;
}

.line.active {
  opacity: 1;
}

@keyframes waveMotion1 {

  0%,
  100% {
    height: 20px;
  }

  50% {
    height: 60px;
  }
}

@keyframes waveMotion2 {

  0%,
  100% {
    height: 30px;
  }

  50% {
    height: 80px;
  }
}

@keyframes waveMotion3 {

  0%,
  100% {
    height: 10px;
  }

  50% {
    height: 50px;
  }
}

@keyframes waveMotion4 {

  0%,
  100% {
    height: 40px;
  }

  50% {
    height: 70px;
  }
}

@keyframes waveMotion5 {

  0%,
  100% {
    height: 16px;
  }

  50% {
    height: 56px;
  }
}
</style>