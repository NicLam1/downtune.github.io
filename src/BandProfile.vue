<template>
  <div class="band-profile-container">
    <div v-if="loading" class="loading-spinner">
      <i class="fas fa-spinner fa-spin fa-3x"></i>
    </div>

    <div v-else-if="band" class="band-profile-content">
      <BandDetails :bandId="band.id" />
    </div>

    <div v-else class="error-message">
      <p>Band not found.</p>
    </div>
  </div>
</template>

<script>
import BandDetails from './BandDetails.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'BandProfile',
  components: {
    BandDetails,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const band = ref(null);
    const loading = ref(true);
    const error = ref(false);

    // Fetching logic is moved to BandDetails.vue
    onMounted(() => {
      // No additional logic needed here as BandDetails handles data fetching
      // However, you might want to pass the bandId to BandDetails
      band.value = { id: parseInt(route.params.id, 10) };
      if (isNaN(band.value.id)) {
        error.value = true;
        loading.value = false;
      }
    });

    return {
      band,
      loading,
      error,
    };
  },
};
</script>

<style scoped>
/* Include necessary styles or keep them in BandDetails.vue */
.band-profile-container {
  /* Styles as per original BandProfile.vue */
}
</style>
