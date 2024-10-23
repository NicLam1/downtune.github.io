<template>
  <div class="background-wrapper" :style="{ background: backgroundGradient }">
  <div class="carousel-wrapper">  <!-- Wrapper to center the carousel -->
    <swiper
      :modules="[EffectCoverflow, Pagination, Navigation]"
      effect="coverflow"
      grab-cursor="true"
      centered-slides="true"
      :slides-per-view=auto
      :coverflowEffect="{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
      }"
      :pagination="{
        el: '.swiper-pagination',
        clickable: true
      }"
      :navigation="{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }"
      :breakpoints="{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 3 }
      }"
      @slideChange="onSlideChange"
      class="mySwiper"
    >
      <swiper-slide v-for="(slide, index) in slides" :key="index">
        <img :src="slide.url" :alt="slide.title" />
      </swiper-slide>
      <!-- Pagination -->
      <div class="swiper-pagination"></div>
      <!-- Navigation arrows -->
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </swiper>
    <div class="d-flex justify-content-center align-items-center" style="height: 100px;">
      <h1 class="text-center">{{ currentSlideTitle }}</h1>
    </div>
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
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    // Return the Swiper modules for the Composition API
    return {
      EffectCoverflow,
      Pagination,
      Navigation,
    };
  },
  data() {
    return {
      currentSlideTitle: "Rock",
      selectedGenre: "",
      slides: [
        {title:'Rock', url:'../images/userQuestionImg/rock.jpg'},
        {title:'Pop', url:'../images/userQuestionImg/pop.jpeg'},
        {title:'Jazz', url:'../images/userQuestionImg/jazz.jpg'},
        {title:'Electronic', url:'../images/userQuestionImg/electronic.jpg'},
      ],
    };
  },
  methods: {
    // Update h1 when the centered slide changes
    onSlideChange(swiper) {
      const currentIndex = swiper.realIndex;  // Get the currently centered slide index
      this.currentSlideTitle = this.slides[currentIndex].title;  // Update h1 text
      this.selectedGenre = this.slides[currentIndex].title;

    },
  },
  computed:{
    backgroundGradient() {
      switch (this.selectedGenre) {
        case 'Rock':
          return 'linear-gradient(135deg, darkblue, lightblue)';
        case 'Pop':
          return 'linear-gradient(135deg, lightpink, pink)';
        case 'Jazz':
          return 'linear-gradient(135deg, dimgray, black)'; // 'dimgray' for the charcoal-like color
        case 'Electronic':
          return 'linear-gradient(135deg, cyan, dodgerblue)'; // 'dodgerblue' is a good match for a bright blue
        case 'Classical':
          return 'linear-gradient(135deg, beige, mistyrose)'; // 'beige' and 'mistyrose' are close to soft beige/pink tones
        default:
          return 'linear-gradient(135deg, white, lightgray)'; // Default background
      }
    },
  }
};
</script>
<style scoped>
.carousel-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Horizontally center */
  align-items: center;     /* Vertically center */
  height: 100vh;           /* Full viewport height */
  width: 100%;             /* Full width */
}

.mySwiper {
  width: 80%;  /* You can adjust this value */
  height: 300px;  /* Height of the carousel */
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 300px;
  height: 100%;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-button-next,
.swiper-button-prev {
  color: #000;
}
</style>
