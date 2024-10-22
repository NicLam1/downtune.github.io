<template>
  <div class="background-wrapper" :style="{ background: backgroundGradient }">
    <div class="container-sm py-4 position-relative quiz-container">
      <!-- Progress bar and Back button -->
      <div class="d-flex align-items-center mb-4">
        <button class="btn btn-link fs-3 me-4" @click="handleBack" :disabled="currentQuestionIndex === 0">←</button>
        <div class="progress flex-grow-1">
          <div
            class="progress-bar progress-bar-striped progress-bar-animated bg-info"
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
            <div class="bg-light p-3 rounded w-100">
              <p class="fw-semibold text-center">{{ currentQuestion.question }}</p>
            </div>
          </div>

          <div class="row">
            <div v-for="(option, index) in currentQuestion.options" :key="index" class="col-6">
              <button
                class="w-100 p-3 my-1"
                :class="isSelected(option) ? 'btn btn-secondary' : 'btn btn-primary'"
                @click="handleAnswer(option)"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Show answers after all questions are completed -->
      <div v-if="currentQuestionIndex === questions.length-1" class="mt-4">
        <h4>All answers:</h4>
        <pre>{{ answers }}</pre>
      </div>

      <!-- Continue button -->
      <button
        v-if="currentQuestionIndex < questions.length"
        class="btn btn-success w-100"
        @click="handleContinue"
        :disabled="!answers[currentQuestion.id]"
      >
        {{ currentQuestionIndex === questions.length - 1 ? 'FINISH' : 'CONTINUE' }}
      </button>
    </div>
  </div>
</template>



<script>
export default {
  data() {
    return {
      currentQuestionIndex: 0,
      answers: {},  // Keep track of answers
      selectedGenre: '',  // This will store the selected genre from Question 1

      questions: [
        {
          id: 1,
          question: "What type of music are you looking for?",
          options: ["rock", "pop", "jazz", "electronic", "classical"],
        },
        {
          id: 2,
          question: "Q2",
          options: ["Opt 1", "Opt 2", "Opt 3", "Opt 4"],
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
    },
    backgroundGradient() {
  switch (this.selectedGenre) {
    case 'rock':
      return 'linear-gradient(135deg, darkblue, lightblue)';
    case 'pop':
      return 'linear-gradient(135deg, lightpink, pink)';
    case 'jazz':
      return 'linear-gradient(135deg, dimgray, black)'; // 'dimgray' for the charcoal-like color
    case 'electronic':
      return 'linear-gradient(135deg, cyan, dodgerblue)'; // 'dodgerblue' is a good match for a bright blue
    case 'classical':
      return 'linear-gradient(135deg, beige, mistyrose)'; // 'beige' and 'mistyrose' are close to soft beige/pink tones
    default:
      return 'linear-gradient(135deg, white, lightgray)'; // Default background
  }
},

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
    handleAnswer(option) {
      this.answers[this.currentQuestion.id] = option;
      
      // If the question is genre selection, set the selected genre for background
      if (this.currentQuestion.id === 1) {
        this.selectedGenre = option;
      }
    },
    isSelected(option) {
      return this.answers[this.currentQuestion.id] === option;
    }
  }
};
</script>



<style scoped>
.background-wrapper {
  min-height: 100vh; /* Full screen height for the wrapper */
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

.quiz-container {
  background-color: white; /* Add background color for contrast */
  border-radius: 15px; /* Slightly rounded corners */
  padding: 20px; /* Padding inside the container */
  width: 50%; /* Container width is 50% of the page */
  min-height: 50vh; /* Minimum height is 50% of the viewport */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for better visibility */
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.col-6 {
  width: 48%; /* Ensure two options fit in each row */
}

button {
  height: 50px; /* Ensure all buttons have the same height */
}

@media (max-width: 768px) {
  .quiz-container {
    width: 90%; /* On smaller screens, make the container wider */
  }
  
  .col-6 {
    width: 100%; /* On smaller screens, make each option span the full width */
  }
}

</style>