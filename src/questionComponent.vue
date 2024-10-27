<template>
  <div class="container row w-75 my-2 mx-auto">
    <div class="question-container col-5">
      <h1 class="py-4">{{ title }}</h1>
      <div v-for="(option, index) in options" :key="index" class="my-2">
        <input
          type="radio"
          :id="'option' + index"
          :value="option"
          v-model="selectedOption"
          class="option-radio"
        />
        <label :for="'option' + index" class="option-button">
          {{ option }}
        </label>
      </div>
    </div>
    <div class="img-container col-7">
      <!-- Image or additional content goes here -->
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'options'],
  data() {
    return {
      selectedOption: null, // Stores the selected option
    };
  },
};
</script>

<style scoped>
.container {
  background-color: rgb(244, 243, 243);
  height: 100vh;
  border-radius: 15px;
  display: flex;
  position: relative;
}
.question-container {
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 0;
  height: 100%;
}
.option-radio {
  display: none; /* Hide the radio input */
}

.option-button {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  text-align: left;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.option-radio:checked + .option-button {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
  font-weight: bold;
}

.option-button:hover {
  background-color: #e2e6ea;
}
</style>
