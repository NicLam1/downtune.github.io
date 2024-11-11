<template>
  <div class="form-container" :style="{ background: backgroundGradient }">
    <div class="welcome-container text-center ">
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
    <Carousel @updateBackgroundGradient="setBackgroundGradient" @selectedGenres="updateGenres" :initialGenre="preselect"></Carousel>
    <MotionGroup preset="slideVisibleLeft" :duration="600">
      <OtherQuestions v-for="(question, index) in questions" :key="index" :title="question.title"
        :options="question.options" :link="question.link" :background="backgroundGradient" :questionIndex="index"
        @selectedOption="updateResponse" :initialSelectedOption="responses[index]">
      </OtherQuestions>
    </MotionGroup>
    <button class="btn btn-primary submit-responses px-5" @click="submitResponses">Submit</button>
    <footer style="font-size: 8px;">
      &zwnj;
      <!-- Guitar Amp by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza
      (https://poly.pizza/m/3FiWjHDj0Zf)<br>
      "Grand Piano" (https://skfb.ly/U87o) by farhad.Guli is licensed under Creative Commons Attribution
      (http://creativecommons.org/licenses/by/4.0/).<br>
      "Electric Guitar" (https://skfb.ly/6nFJX) by haerades is licensed under Creative Commons Attribution-NonCommercial
      (http://creativecommons.org/licenses/by-nc/4.0/).<br>
      DJ gear by Poly by Google [CC-BY] via Poly Pizza<br> -->
    </footer>
  </div>

</template>

<script>
import { auth } from '../firebaseConfig';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getDoc } from 'firebase/firestore';

import Carousel from './Carousel.vue';
import OtherQuestions from './questionComponent.vue';

export default {
  components: {
    Carousel,
    OtherQuestions,
  },
  data() {
    return {
      backgroundGradient: 'linear-gradient(135deg, purple, rebeccapurple)',
      showArrow: true,
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
  async mounted() {
    setTimeout(() => {
      this.showArrow = false;
    }, 6500);

    // Fetch user preferences if the user is logged in
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const docRef = doc(db, 'userPreferences', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const preferences = docSnap.data();
        this.genres = preferences.genres || [];
        this.responses = {
          0: preferences.eventType,
          1: preferences.budget,
          2: preferences.eventDuration,
          3: preferences.eventLocation,
        };
        console.log(this.responses)
      }
    }
  },
  methods: {
    setBackgroundGradient(gradient) {
      this.backgroundGradient = gradient; // Update the parent background
    },
    updateResponse({ questionIndex, selectedOption }) {
      this.responses[questionIndex] = selectedOption;
    },
    async submitResponses() {
      console.log(this.responses);
      console.log(this.genres);

      const user = auth.currentUser;
      if (!user) {
        console.error("No user is currently signed in.");
        return;
      }

      const userId = user.uid; // Retrieve the user ID
      const preferences = {
        genres: this.genres,
        eventType: this.responses[0],
        budget: this.responses[1],
        eventDuration: this.responses[2],
        eventLocation: this.responses[3],
      };

      try {
        // Save preferences directly to Firestore using the modular syntax
        await setDoc(doc(collection(db, "userPreferences"), userId), preferences);
        console.log("User preferences saved successfully!");
        this.$router.push('/');
      } catch (error) {
        console.error("Error saving preferences:", error);
      }
    },
    updateGenres(genres) {
      this.genres = genres;
    }
  },
};
</script>

<style scoped>

.welcome-container {
  height: 95vh;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  color: white;
}

.welcome-text {
  font-size: 80px;
}
@media (max-width: 768px) {
  .welcome-text {
    font-size: 4rem; /* Smaller font size for tablets */
  }
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
  display: block;
  margin: 20px auto;
}


.btn-primary {
  background: linear-gradient(135deg, #d900ff, #7500e8);
  border: none;
  transition: background-color 0.3s;
  border-radius: 4px !important;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #ff66ff, #c603ff);
}
</style>
