<template>
  <div class="container row w-75 my-2 mx-auto">
    <div class="question-container col-12 col-md-6 col-lg-5 h-75">
      <h1 class="py-4">{{ title }}</h1>

      <!-- Band Name -->
      <div v-if="title === 'Introduce yourselves! What is your band called?'" class="my-2">
        <textarea 
          v-model="bandName" 
          class="form-control option-input" 
          placeholder="Enter band name..." 
          @input="emitSelectedOption(bandName)"
        ></textarea>
      </div>

      <!-- Textarea for the "Write a bio" question -->
      <div v-else-if="title === 'Let\'s get to know your band! Share a captivating bio that tells your story.'" class="my-2">
        <textarea 
          v-model="bio" 
          class="form-control option-input" 
          placeholder="Enter bio..." 
          rows="5"
          @input="emitSelectedOption(bio)"
        ></textarea>
      </div>

      <!-- Dynamic member inputs for "Introduce your crew" question -->
      <div v-else-if="title === 'Introduce your crew! Who makes up your band?'" class="my-2">
        <input 
          type="number" 
          v-model.number="memberCount" 
          class="form-control option-input" 
          placeholder="Enter number of band members" 
          min="1" max="8"
          @input="updateMemberNames"
        />
        <div v-for="index in memberCount" :key="index" class="my-2">
          <input 
            type="text" 
            v-model="memberNames[index - 1]" 
            class="form-control option-input" 
            :placeholder="'Member ' + index + ' name'" 
            @input="emitSelectedOption(memberNames)"
          />
        </div>
      </div>

      <!-- File upload for "Upload photos" question -->
      <div v-else-if="title === 'Give your profile some personality! Upload some awesome photos that showcase your vibe.'" class="my-2">
        <input 
          type="file" 
          @change="handleImageUpload" 
          accept="image/*" 
          class="form-control-file" 
        />
        
        <!-- Preview and delete option if image is uploaded -->
        <div v-if="uploadedImage" class="mt-3 text-center">
          <img :src="uploadedImage" alt="Uploaded image preview" class="img-fluid" style="max-width: 100%; height: auto;">
          <div class="mt-2">
            <button class="btn btn-danger btn-sm" @click="deleteImage">Delete Image</button>
          </div>
        </div>
      </div>

      <!-- Default input field for other questions -->
      <div v-else class="my-2">
        <input 
          type="text" 
          v-model="spotifyLink" 
          class="form-control option-input" 
          placeholder="Stick your Spotify link..." 
          @input="emitSelectedOption(spotifyLink)"
        />
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
  props: ['title', 'link', 'questionIndex'],
  data() {
    return {
      bandName: '',        // For storing band name
      bio: '',             // For storing bio
      memberCount: 1,
      memberNames: [''],   // Array to hold member names
      uploadedImage: null, // Stores the URL of the uploaded image for preview
      spotifyLink: ''      // For storing Spotify link
    };
  },
  methods: {
    emitSelectedOption(value) {
      this.$emit('selectedOption', { questionIndex: this.questionIndex, selectedOption: value });
    },
    updateMemberNames() {
      this.memberNames = Array(this.memberCount).fill('');
      this.emitSelectedOption(this.memberNames);
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedImage = URL.createObjectURL(file); // Create a temporary URL for image preview
        this.emitSelectedOption(this.uploadedImage);
      }
    },
    deleteImage() {
      this.uploadedImage = null; // Remove the uploaded image
      this.emitSelectedOption(null); // Emit null if image is deleted
    }
  }
};
</script>


  
  <style scoped>
  .container {
    height: 75vh;
    border-radius: 15px;
    display: flex;
  
  }

  
  .question-container {
    padding: 2rem;
    border-radius: 8px;
    /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
    height: 100%;

    margin-bottom: 4rem; /* Space between questions */
    overflow: auto; /* Allows for scrolling if needed */
    border: 1px solid #ddd; /* Optional: adds a border for clarity */
    border-radius: 5px; /* Optional: rounds the corners */
    
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

  /*  */
  </style>
  