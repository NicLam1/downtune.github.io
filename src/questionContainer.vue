<template>
  <div class="form-container" :style="{ background: backgroundGradient }">
    <MotionGroup preset="slideVisibleLeft" :duration="600">
      <section>
        <Carousel @updateBackgroundGradient="setBackgroundGradient" @scroll="scroll"></Carousel>
      </section>
      <div v-for="(question, index) in questions" :key="index">
        <OtherQuestions :title="question.title" :options="question.options"></OtherQuestions>
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
      questions:[{title: 'Question 1', options: ['1', '2', '3', '4']},
      {title: 'Question 2', options: ['a', 'b', 'c', 'd']}
      ],
    };
  },
  methods: {
    setBackgroundGradient(gradient) {
      this.backgroundGradient = gradient; // Update the parent background
    },
  },
};
</script>

<style scoped>

</style>
