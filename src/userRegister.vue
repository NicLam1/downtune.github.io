<template>
  <div>
    <div v-if="!isRegistered" class="backgroundMain d-flex justify-content-center align-items-center w-100">
      <!-- Registration Form Section (already exists) -->
      <div class="background" style="background-image: url('/img2/gig.jpg')"></div>
      <div class="fog-container">
        <div class="fog-img fog-img-first"></div>
        <div class="fog-img fog-img-second"></div>
      </div>
      <div class="container min-h-screen d-flex justify-content-center align-items-center">
        <div class="card col-12 col-md-8 col-lg-6 h-100 shadow-lg overflow-hidden">
          <div class="row g-0 h-100">
            <div class="col-md-8 col-12 p-5 col-flex d-flex flex-column">
              <button class="btn btn-secondary mb-4 w-25" @click="goBack">
                <i class="fas fa-arrow-left"></i> Back
              </button>
              <h2 class="text-center text-light fw-bold mb-4">Register</h2>
              <form @submit.prevent="handleRegister" class="d-flex flex-column justify-content-center text-light">
                <div class="mb-3">
                  <label for="email-address" class="form-label">Email address</label>
                  <input type="email" v-model="email" class="form-control" id="email" required />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" v-model="password" class="form-control" id="password" required />
                </div>
                <div class="mb-3">
                  <label for="password-confirm" class="form-label">Confirm Password</label>
                  <input type="password" v-model="confirmPassword" class="form-control" id="confirmPassword" required />
                </div>
                <div class="mb-3">
                  <label for="username" class="form-label">Display Name</label>
                  <input type="text" v-model="username" class="form-control" id="username" required />
                </div>
                <p v-if="error" class="text-danger">{{ error }}</p>
                <button type="submit" class="btn btn-light w-100">Sign Up</button>
              </form>
              <p class="text-center mt-3 text-light">
                Have an account?
                <router-link to="/login/user" class="text-light">
                  Sign In
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Question Container Section (Visible after registration) -->
    <div v-else>
      <QuestionContainer :user="user" @submit="updatePreferences"></QuestionContainer>
    </div>
  </div>
</template>

<script>
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import QuestionContainer from "./questionContainer.vue";
import { inject } from "vue";

export default {
  mounted() {
    const user = auth.currentUser;
    if (user) {
      this.isRegistered = true;
      this.user = user;
      this.setLoginState(true, user.uid, user.displayName); // Keep login state in sync
    }
  },

  components: {
    QuestionContainer,
  },
  data() {
    return {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      error: "",
      isRegistered: false,
      user: null, // Store user object
    };
  },
  setup() {
    const setLoginState = inject("setLoginState");
    return { setLoginState };
  },
  methods: {
    async handleRegister() {
      this.error = "";

      const user = auth.currentUser;
      if (user) {
        this.isRegistered = true; // Skip registration if user is logged in
        this.user = user; // Assign the current user object
      }

      // Basic validation for password matching
      if (this.password !== this.confirmPassword) {
        this.error = "Passwords do not match.";
        return;
      }

      try {
        // Create the user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;

        // Set the username as the display name in Firebase
        await updateProfile(user, {
          displayName: this.username,
        });

        console.log("User successfully registered:", user);
        this.isRegistered = true;
        this.user = user; // Store the user object
        this.setLoginState(true, user.uid, user.displayName);
      } catch (error) {
        console.error("Error during registration:", error);
        this.error = "Email is already in use.";
      }
    },
    goBack(){
      this.$router.push("/choose");
    }

    // Method to update user preferences in Firestore after they answer the questions
    // async updatePreferences(preferences) {
    //   try {
    //     const userId = this.user.uid; // Use the current user's UID
    //     const docRef = doc(db, "userPreferences", userId);
    //     await setDoc(docRef, preferences); // Store preferences in Firestore
    //     console.log("Preferences updated successfully!");
    //   } catch (error) {
    //     console.error("Error updating preferences:", error);
    //   }
    // },
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
  background: linear-gradient(135deg, #2e0847, #450e55, #5b1d66);

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
</style>
