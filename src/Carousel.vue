<template>
  <div class="background-wrapper">
    <div class="carousel-wrapper"> <!-- Wrapper to center the carousel -->
      <div class="question mb-5 text-center">
        <h1>What genre of music are you looking for?</h1>
        <h3 :class="{ 'bounce-text': bounceLimitReached }">Click up to 3</h3>
      </div>

      <swiper :modules="[EffectCoverflow, Pagination, Navigation]" effect="coverflow" :grab-cursor="true" :loop="true"
        :centered-slides="true" :slides-per-view="'auto'" :coverflowEffect="{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        }" :pagination="{
          el: '.swiper-pagination',
          clickable: true
        }" :navigation="{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }" :breakpoints="{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 3 }
        }" @slideChange="onSlideChange" :allow-touch-move="true" class="mySwiper">
        <swiper-slide v-for="(slide, index) in slides" :key="index"
          :class="{ 'selected-genre': isGenreSelected(slide.title) }" @click="toggleGenreSelection(slide.title)">
          <img :src="slide.url" :alt="slide.title" />
        </swiper-slide>

        <!-- Pagination -->
        <div class="swiper-pagination"></div>
        <!-- Navigation arrows -->
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </swiper>

      <!-- Display the title of the current genre -->
      <div class="d-flex justify-content-center align-items-center" style="height: 100px;">
        <h1 class="text-center">{{ currentSlideTitle }}</h1>
      </div>

      <!-- Single Button for selecting/deselecting current genre -->
      <!-- <button
        :class="{'btn btn-primary': !isGenreSelected(currentGenre), 'btn btn-danger': isGenreSelected(currentGenre)}"
        @click="toggleGenreSelection(currentGenre)"
      >
        {{ isGenreSelected(currentGenre) ? 'Deselect' : 'Select' }} {{ currentGenre }}
      </button> -->

    </div>
  </div>
</template>


<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules'; // Import needed modules
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default {
  props: ['initialGenres'],
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      EffectCoverflow,
      Pagination,
      Navigation,
    };
  },
  data() {
    return {
      currentSlideTitle: "Rock",
      currentGenre: "Rock",
      userSelection: [],
      slides: [
        { title: 'Rock', url: '/userQuestionImg/rock.jpg' },
        { title: 'Pop', url: '/userQuestionImg/pop.jpeg' },
        { title: 'Jazz', url: '/userQuestionImg/jazz.jpg' },
        { title: 'Electronic', url: '/userQuestionImg/electronic.jpg' },
        { title: 'Country', url: '/userQuestionImg/country.webp' },
        { title: 'Ambient', url: '/userQuestionImg/ambient.webp' },
        { title: 'Blues', url: '/userQuestionImg/blues.jpg' },
        { title: 'Hip Hop', url: '/userQuestionImg/hiphop.jpg' },
        { title: 'Metal', url: '/userQuestionImg/metal.webp' },
        { title: 'Reggae', url: '/userQuestionImg/reggae.webp' },

      ],
      bounceLimitReached: false,
    };
  },
  methods: {
    // Update h1 when the centered slide changes
    onSlideChange(swiper) {
      const currentIndex = swiper.realIndex;  // Get the currently centered slide index
      this.currentSlideTitle = this.slides[currentIndex].title;  // Update h1 text
      this.currentGenre = this.slides[currentIndex].title;

    },
    // Toggles the current genre in the user's selection list
    toggleGenreSelection(genre) {
      if (this.userSelection.includes(genre)) {
        // If the genre is already selected, remove it
        const index = this.userSelection.indexOf(genre);
        this.userSelection.splice(index, 1);
      } else {
        // Add the genre to the selected list (ensure the user can only select up to 3)
        if (this.userSelection.length < 3) {
          this.userSelection.push(genre);
        } else {
          this.triggerBounceAnimation();
        }
      }
      this.$emit('selectedGenres', this.userSelection);
    },

    // Check if a genre is already selected
    isGenreSelected(genre) {
      return this.userSelection.includes(genre);
    },
    triggerBounceAnimation() {
      this.bounceLimitReached = true;
      setTimeout(() => {
        this.bounceLimitReached = false; // Remove the bounce effect after the animation duration
      }, 1000); // Adjust the timeout based on the animation duration
    },
  },
  computed: {
    backgroundGradient() {
      switch (this.currentGenre) {
        case 'Rock':
          return 'linear-gradient(135deg, forestgreen, darkseagreen)';
        case 'Pop':
          return 'linear-gradient(135deg, lightpink, pink)';
        case 'Jazz':
          return 'linear-gradient(135deg, chocolate, coral)';
        case 'Electronic':
          return 'linear-gradient(135deg, cyan, dodgerblue)';
        case 'Classical':
          return 'linear-gradient(135deg, beige, mistyrose)';
        case 'Country':
          return 'linear-gradient(135deg, goldenrod, peru)';
        case 'Ambient':
          return 'linear-gradient(135deg, lavender, lightsteelblue)';
        case 'Blues':
          return 'linear-gradient(135deg, royalblue, skyblue)';
        case 'Hip Hop':
          return 'linear-gradient(135deg, darkorange, orangered)';
        case 'Metal':
          return 'linear-gradient(135deg, darkslategray, silver)';
        case 'Reggae':
          return 'linear-gradient(135deg, yellowgreen, limegreen)';
        default:
          return 'linear-gradient(135deg, forestgreen, darkseagreen)'; // Default background
      }
    },
  },
  watch: {
    // Watch for changes in backgroundGradient
    backgroundGradient(newGradient) {
      this.$emit('updateBackgroundGradient', newGradient);
    },
    initialGenres(newValue) {
      console.log('initialGenres watcher triggered:', newValue);
      this.userSelection = newValue || [];
    }
  },
};
</script>
<style scoped>
.background-wrapper {
  min-height: 100vh;
  /* Ensure the wrapper fills the entire viewport height */
  display: flex;
  flex-direction: column;
  color: white;
}

.carousel-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Horizontally center */
  align-items: center;
  /* Vertically center */
  height: 100vh;
  /* Full viewport height */
  width: 100%;
  /* Full width */
}

.mySwiper {
  width: 80%;
  /* You can adjust this value */
  height: 300px;
  /* Height of the carousel */
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 300px;
  height: 100%;
  transition: border 0.3s ease;
}

.swiper-slide-active {
  cursor: pointer;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-button-next,
.swiper-button-prev {
  color: #ffffff;
}

.selected-genre {
  border: 5px solid limegreen;
  /* Bright green border */
  border-radius: 10px
}

@keyframes bounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-20px);
  }

  60% {
    transform: translateY(-10px);
  }
}

.bounce-text {
  animation: bounce 1s ease;
  /* Apply the bounce animation for 1 second */
}
</style>
