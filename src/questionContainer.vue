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
          repeat: 3,
        }
      }" :delay="3000" :duration="2000" class="scroll-arrow">
        <i class="fa fa-arrow-down"></i>
      </div>
    </div>
    <Carousel @updateBackgroundGradient="setBackgroundGradient" @scroll="scroll"></Carousel>
    <MotionGroup preset="slideVisibleLeft" :duration="600">
      <div v-for="(question, index) in questions" :key="index">
        <OtherQuestions :title="question.title" :options="question.options" :background="backgroundGradient">
        </OtherQuestions>
      </div>
    </MotionGroup>
  </div>
</template>

<script>
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
      questions: [{ title: 'What is your budget for hiring the band?', options: ['1', '2', '3', '4'] },
      { title: 'Question 2', options: ['a', 'b', 'c', 'd'] }
      ],
    };
  },
  mounted() {
    setTimeout(() => {
      this.showArrow = false;
    }, 9000);
  },
  methods: {
    setBackgroundGradient(gradient) {
      this.backgroundGradient = gradient; // Update the parent background
    },
  },
};
</script>

<style scoped>
.welcome-container {
  height: 100vh;
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
  left: 20px;
}
</style>
