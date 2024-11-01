<template>

  <div v-if="!isRegistered" class="backgroundMain d-flex justify-content-center align-items-center w-100">
    <div class="container min-h-screen d-flex justify-content-center align-items-center">
      <div class="card w-100 h-100 shadow-lg overflow-hidden">
        <div class="row g-0 h-100">
          <!-- Login Form Section -->
          <div class="col-md-8 col-12 p-5 col-flex d-flex flex-column">
            <h2 class="text-center text-dark fw-bold mb-4">Register</h2>
            <form @submit.prevent="handleRegister" class="d-flex flex-column justify-content-center">
              <div class="mb-3">
                <label for="email-address" class="form-label">Email address</label>
                <input type="email" v-model="email" class="form-control" id="email" required />
              </div>
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" v-model="username" class="form-control" id="username" required />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" v-model="password" class="form-control" id="password" required />
              </div>
              <div class="mb-3">
                <label for="password-confirm" class="form-label">Confirm Password</label>
                <input type="password" v-model="confirmPassword" class="form-control" id="confirmPassword" required />
              </div>
              <p v-if="error" class="text-danger">{{ error }}</p>
              <button type="submit" class="btn btn-primary w-100">Sign Up</button>
            </form>
            <p class="text-center mt-3">
              Have an account?
              <router-link to="/login">
                <a class="text-primary">Sign In</a>
              </router-link>
            </p>
          </div>

          <!-- Carousel Section -->
          <div class="col-md-4 col-0 col-flex d-none d-md-block">
            <div id="carouselExampleSlidesOnly" class="carousel slide h-100" data-bs-ride="carousel">
              <div class="carousel-inner h-100">
                <div class="carousel-item active">
                  <img src="../images/stock band/image1.jpg" class="d-block w-100" alt="Slide 1">
                </div>
                <div class="carousel-item">
                  <img src="../images/stock band/image2.jpg" class="d-block w-100" alt="Slide 2">
                </div>
                <div class="carousel-item">
                  <img src="../images/stock band/image3.jpg" class="d-block w-100" alt="Slide 3">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <QuestionContainer></QuestionContainer>
  </div>
</template>

<script>
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import QuestionContainer from './questionContainer.vue';

export default {
  components: {
    QuestionContainer
  },
  data() {
    return {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      error: '',
      isRegistered: false,
    };
  },
  methods: {
    async handleRegister() {
      this.error = '';

      // Basic validation for password matching
      if (this.password !== this.confirmPassword) {
        this.error = "Passwords do not match.";
        return;
      }

      try {
        // Create the user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Set the username as the display name in Firebase
        await updateProfile(user, {
          displayName: this.username
        });

        console.log("User successfully registered:", user);
        this.isRegistered = true;
      } catch (error) {
        console.error("Error during registration:", error);
        this.error = error.message;
      }
    }
  },
};
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.card {
  /* height: 100%; */
}

.col-flex {
  /* flex: 1; */
}

.carousel-item {
  height: 100%;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.backgroundMain {
  /* background: linear-gradient(to right, black , rgb(85, 98, 110)); */
}
</style>

<!-- Bootstrap -->
