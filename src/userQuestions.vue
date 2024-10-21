<template>
  <div class="container py-4">
    <!-- Progress bar and Back button -->
    <div class="d-flex align-items-center mb-4">
      <button class="btn btn-link fs-3 me-4" @click="handleBack" :disabled="currentQuestionIndex === 0">←</button>
      <div class="progress flex-grow-1">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated bg-success"
          role="progressbar"
          :style="{ width: `${progress}%` }"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>

    <!-- Animated question and answers -->
    <transition name="slide-fade" mode="out-in">
      <div :key="currentQuestion.id" class="mb-4">
        <div class="d-flex align-items-center mb-4">
          <div class="bg-success text-white d-flex justify-content-center align-items-center rounded-circle me-4" style="width: 64px; height: 64px;">
            <span class="fs-1">🦉</span>
          </div>
          <div class="bg-light p-3 rounded">
            <p class="fw-semibold">{{ currentQuestion.question }}</p>
          </div>
        </div>

        <!-- If question is about language selection -->
        <div v-if="currentQuestion.type === 'language'" class="row g-3 mb-4">
          <div
            v-for="lang in languages"
            :key="lang.name"
            class="col-6"
          >
            <button
              class="btn btn-outline-secondary w-100 p-3 d-flex justify-content-start align-items-center"
              :class="{ 'border-success': isSelected(lang.name) }"
              @click="handleAnswer(lang.name)"
            >
              <span class="fs-3 me-3">{{ lang.flag }}</span>
              <div class="text-start">
                <p class="fw-semibold mb-0">{{ lang.name }}</p>
                <p class="small text-muted">{{ lang.learners }} learners</p>
              </div>
            </button>
          </div>
        </div>

        <!-- If question has options -->
        <div v-else class="row g-3 mb-4">
          <div v-for="option in currentQuestion.options" :key="option" class="col-12">
            <button
              class="btn btn-outline-secondary w-100 p-3"
              :class="{ 'border-success': isSelected(option) }"
              @click="handleAnswer(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Continue button -->
    <button
      class="btn btn-success w-100"
      @click="handleContinue"
      :disabled="!answers[currentQuestion.id]"
    >
      {{ currentQuestionIndex === questions.length - 1 ? 'FINISH' : 'CONTINUE' }}
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentQuestionIndex: 0,
      answers: {},  // Keep track of answers
      languages: [
        { name: 'Spanish', learners: '49M', flag: '🇪🇸' },
        { name: 'French', learners: '27M', flag: '🇫🇷' },
        { name: 'Japanese', learners: '23M', flag: '🇯🇵' },
        { name: 'German', learners: '19M', flag: '🇩🇪' },
        { name: 'Korean', learners: '18M', flag: '🇰🇷' },
        { name: 'Italian', learners: '13M', flag: '🇮🇹' },
        { name: 'Hindi', learners: '11M', flag: '🇮🇳' },
        { name: 'Chinese', learners: '11M', flag: '🇨🇳' },
        { name: 'Russian', learners: '9M', flag: '🇷🇺' },
        { name: 'English', learners: '8.7M', flag: '🇺🇸' },
      ],
      questions: [
        {
          id: 1,
          question: "What would you like to learn?",
          type: "language",
        },
        {
          id: 2,
          question: "What's your learning goal?",
          options: ["Travel", "Business", "Academic", "Personal interest"],
        },
        {
          id: 3,
          question: "How much time can you dedicate to learning each day?",
          options: ["5 minutes", "15 minutes", "30 minutes", "1 hour or more"],
        },
      ],
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    progress() {
      return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    }
  },
  methods: {
    handleContinue() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      }
    },
    handleBack() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
    },
    handleAnswer(answer) {
      // Directly update the reactive answers object in Vue 3
      this.answers[this.currentQuestion.id] = answer;
    },
    isSelected(option) {
      // Check if the answer is selected
      return this.answers[this.currentQuestion.id] === option;
    }
  }
};

</script>

<style scoped>

/* Slide transition for question change */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

</style>
