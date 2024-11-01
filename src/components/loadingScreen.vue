<template>
  <div v-if="isLoading" id="loading-screen">
    <div class="notes-container">
      <div class="note">&#9835;</div>
      <div class="note">&#9834;</div>
      <div class="note">&#9835;</div>
      <div class="note">&#9834;</div>
    </div>
    <p>{{ currentMessage }}</p>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      messages: [
        "Tuning the guitar...",
        "Mic test, mic test...",
        "Warming up the vocals...",
        "Loading Beats...",
        "Setting the stage...",
        "Turning up the volume...",
        "Checking the sound levels...",
        "Strumming the chords...",
        "Plugging in the amp...",
        "Powering up the speakers...",
        "Finding the perfect rhythm...",
        "Preparing the soundcheck...",
        "Adjusting the bass...",
        "Loading the playlist...",
        "Finalizing the tracklist...",
        "Syncing the instruments...",
        "Bringing the band together...",
        "Mastering the mix...",
        "Getting in tune...",
        "Preparing for the encore...",
      ],

      currentIndex: 0,
      currentMessage: "Loading Beats...", // Default message
    };
  },
  mounted() {
    // Start cycling the messages every 2 seconds
    this.startMessageCycle();
  },
  methods: {
    startMessageCycle() {
      setInterval(() => {
        // Update the current message by cycling through the messages array
        this.currentMessage = this.messages[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.messages.length;
      }, 2000); // Change every 2 seconds
    },
  },
};
</script>

<style scoped>
#loading-screen {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.notes-container {
  display: flex;
  gap: 20px;
  /* Adds spacing between the notes */
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  /* Creates space between notes and the text */
}

.note {
  font-size: 40px;
  color: #3498db;
  animation: bounce 1.5s ease-in-out infinite;
}

.note:nth-child(1) {
  animation-delay: 0s;
}

.note:nth-child(2) {
  animation-delay: 0.2s;
}

.note:nth-child(3) {
  animation-delay: 0.4s;
}

.note:nth-child(4) {
  animation-delay: 0.6s;
}

p {
  font-size: 20px;
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
    /* Start and end at original position */
  }

  50% {
    transform: translateY(-30px);
    /* Move up */
  }
}
</style>