<template>
  <div class="backgroundMain d-flex justify-content-center align-items-center w-100">
    <div class="container  min-h-screen d-flex justify-content-center align-items-center">
      <div class="card w-100 h-100 shadow-lg overflow-hidden">
        <div class="row g-0 h-100">
          <!-- Login Form Section -->
          <div class="col-md-8 col-12 p-5 col-flex d-flex flex-column">
            <h2 class="text-center text-dark fw-bold mb-4">Sign in to your account</h2>
            <form @submit.prevent="handleSubmit" class="d-flex flex-column justify-content-center">
              <div class="mb-3">
                <label for="email-address" class="form-label">Email address</label>
                <input type="email" id="email-address" v-model="email" name="email" class="form-control"
                 required />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" v-model="password" name="password" class="form-control"
                   required />
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="remember-me" v-model="rememberMe">
                  <label class="form-check-label" for="remember-me">Remember me</label>
                </div>
                <a href="/forgot-password" class="text-primary">Forgot your password?</a>
              </div>
              <button type="submit" class="btn btn-primary w-100">Sign in</button>
            </form>
            <p class="text-center mt-3">
              Don't have an account?
              <router-link to="/register">
               <a class="text-primary">Sign up</a>
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
</template>

<script>
import { auth } from '../firebaseConfig.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
export default {
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        console.log("User successfully logged in:", user);
      } catch (error) {
        console.error("Error logging in:", error);
        this.error = error.message;
      }
    }

  }
};
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.card {
  /* height: 100%; */
  border: none;
}

.col-flex {
  /* flex: 1; */
}

.carousel-item {
  height: 100%;
}

.carousel.slide {
  height: 100%;
  
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.backgroundMain {

}
</style>
