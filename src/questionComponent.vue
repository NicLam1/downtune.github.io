<template>
  <div class="container row w-75 my-2 mx-auto">
    <div class="question-container col-12 col-md-6 col-lg-5 h-75">
      <h1 class="py-4">{{ title }}</h1>
      <div v-for="(option, index) in options" :key="index" class="my-2">
        <input type="radio" :id="'option' + questionIndex + '-' + index" :value="option" v-model="selectedOption"
          class="option-radio" />
        <label :for="'option' + questionIndex + '-' + index" class="option-button">
          {{ option }}
        </label>
      </div>
    </div>
    <div class="img-container d-none d-md-block col-md-6 col-lg-7">
      <model-viewer
      :src="link"  
      auto-rotate
      camera-controls
      disable-zoom 
      style="width: 100%; height: 500px;"
    ></model-viewer>
    </div>
  </div>
</template>

<script>
import '@google/model-viewer';

export default {
  props: ['title', 'options', 'link' ,'questionIndex'],
  components: {
  },
  data() {
    return {
      selectedOption: null, // Stores the selected option
    };
  },
  watch: {
    selectedOption(newValue) {
      // Emit the selected option and question index as soon as the selection changes
      this.$emit('selectedOption', { questionIndex: this.questionIndex, selectedOption: newValue });
    }
  }
};
</script>

<style scoped>
.container {
  height: 100vh;
  border-radius: 15px;
  display: flex;

}

.question-container {
  padding: 2rem;
  border-radius: 8px;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
  height: 100%;
}

.option-radio {
  display: none;
  /* Hide the radio input */
}

.option-button {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  text-align: left;
  background-color: rgba(255, 255, 255, 0.5);
  /* Translucent background */
  border: 1px solid rgba(0, 0, 0, 0.2);
  /* Translucent border */
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.7);
  /* Semi-translucent text */
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, transform 0.2s;
}

.option-radio:checked+.option-button {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
  font-weight: bold;
}

.option-button:hover {
  background-color: #e2e6ea;
}


.img-container img {
  width: 100%;
}
</style>
