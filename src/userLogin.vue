<template>
  <div class="backgroundMain d-flex justify-content-center align-items-center w-100">
    <div class="background" style="background-image: url('/img2/gig.jpg'); filter: blur(5px)"></div>
    <div class="fog-container">
      <div class="fog-img fog-img-first"></div>
      <div class="fog-img fog-img-second"></div>
    </div>
    <div class="container min-h-screen d-flex justify-content-center align-items-center">
      <div class="card col-12 col-md-8 col-lg-6 h-100 col-lg-5 shadow-lg overflow-hidden">
        <div class="row g-0 h-100">
          <!-- Login Form Section -->
          <div class="col-md-8 col-12 p-5 col-flex d-flex flex-column login-section">
            <button class="btn btn-secondary mb-4 w-25" @click="goBack">
              <i class="fas fa-arrow-left"></i> Back
            </button>
            <h2 class="text-center text-light fw-bold mb-4">
              Sign in to your account
            </h2>
            <form @submit.prevent="handleSubmit" class="d-flex flex-column justify-content-center">
              <div class="mb-3">
                <label for="email-address" class="form-label text-light">Email address</label>
                <input type="email" id="email-address" v-model="email" name="email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label text-light">Password</label>
                <input type="password" id="password" v-model="password" name="password" class="form-control" required />
              </div>
              <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
                <router-link to="/forgotPassword" class="text-light mt-2 mt-md-0">Forgot your password?</router-link>
              </div>
              <div class="text-danger">
                {{ error }}
              </div>
              <button type="submit" class="btn btn-light w-100">Sign in</button>
            </form>
            <p class="text-center mt-3 text-light">
              Don't have an account?
              <router-link to="/register/user" class="text-light">
                Sign up
              </router-link>
            </p>
          </div>

          <!-- Carousel Section -->
          <!-- <div class="col-md-4 col-0 col-flex d-none d-md-block">
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
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { inject } from "vue";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
      currentBackground: "/img2/gig.jpg", // Initial background image
    };
  },
  setup() {
    const setLoginState = inject("setLoginState");
    return { setLoginState };
  },
  methods: {
    async handleSubmit() {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;
        console.log("User successfully logged in:", user);
        this.setLoginState(true, user.uid, user.displayName); // Store the user ID and display name
        this.$router.push("/"); // Redirect to home page
      } catch (error) {
        console.error("Error logging in:", error);
        this.error = "Check your email and password and try again.";
      }
    },
    goBack(){
      this.$router.push("/choose");
    }
  },
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: "Poppins", sans-serif;
  background: #000;
  overflow: hidden;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.fog-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  /* Prevent horizontal scrolling */
}

.fog-img {
  position: absolute;
  height: 100%;
  width: 200%;
  /* Adjust width to prevent horizontal scrolling */
  z-index: 3;
}

.fog-img-first {
  background: url("/img2/fog-1.png");
  background-repeat: repeat-x;
  background-size: cover;
  background-position: center;
  animation: marquee 10s linear infinite;
  /* Adjusted duration */
}

.fog-img-second {
  background: url("/img2/fog-2.png");
  background-repeat: repeat-x;
  background-size: cover;
  background-position: center;
  animation: marquee 60s linear infinite;
  /* Adjusted duration */
}

@keyframes marquee {
  0% {
    transform: translate3d(0, 0, 0);
  }

  100% {
    transform: translate3d(-50%,
        0,
        0);
    /* Adjust to prevent horizontal scrolling */
  }
}

.min-h-screen {
  min-height: 100vh;
}

.card {
  border: none;
  border-radius: 4px;
  box-shadow: 0 0 20px 1px #b210af !important;
}

.col-flex {
  flex: 1;
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
  position: relative;
  background: #000;
  overflow: hidden;
}

/* New Styles for Purple Gradient Login Section */
.login-section {
  background: linear-gradient(135deg, #2e0847, #450e55, #5b1d66);
  color: #fff;
}

.btn-light {
  background: #ab47bc;
  color: #fff;
  border: none;
}

.btn-light:hover {
  background: #8e24aa;
}
.btn-secondary {
  background: linear-gradient(135deg, #7100e0, #ac00e8);
  border: none;
  color: #fff;
  transition: background-color 0.3s;
}
.error{
  color: red;
  font-size: 1.2rem;
}
</style>
