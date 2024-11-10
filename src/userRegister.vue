<template>
    <div v-if="!isRegistered" class="register">
        <div class="background" :class="{'fade-out': isFadingOut, 'fade-in': !isFadingOut}" :style="{ backgroundImage: `url(${currentBackground})` }"></div>  <!-- New div for background images -->

        <div class="fog-container">
            <div class="fog-img fog-img-first"></div>
            <div class="fog-img fog-img-second"></div>
        </div>

        <div class="login_wrap">
            <div class="ring" id="hoverCircle" @mouseenter="changeBackground('/img2/gig2.jpg')" @mouseleave="changeBackground('/img2/gig.jpg')">
                <i></i>
                <i></i>
                <i></i>
              
                <div class="container">
                    <div class="w-100">
                        <h2 class="text-center text-dark fw-bold mb-4">Register listener</h2>
                        <form @submit.prevent="handleRegister">
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
                            <router-link to="/login/user" class="text-primary">Sign In</router-link>
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
</template>


<script>
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import QuestionContainer from './questionContainer.vue';
import { inject } from 'vue';

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
    QuestionContainer
  },
  data() {
    return {
    currentBackground: '/img2/gig.jpg', // Initial background image
    isFadingOut: false, // State for fading
    
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      error: '',
      isRegistered: false,
      user: null, // Store user object
    };
  },
  setup() {
    const setLoginState = inject('setLoginState');
    return { setLoginState };
},
    


    
methods: {

    // mouseevent

    changeBackground(newImage) {
        this.isFadingOut = true; // Start fading out
        
        setTimeout(() => {
            this.currentBackground = newImage; // Change the background image
            this.isFadingOut = false; // End fading out
        }, 1000); 
    },

    
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
        this.setLoginState(true, user.uid, user.displayName); 
        } catch (error) {
            console.error("Error during registration:", error);
            this.error = error.message;
        }
    },
    async updatePreferences(preferences) {
      try {
        const userId = this.user.uid;  // Use the current user's UID
        const docRef = doc(db, 'userPreferences', userId);
        await setDoc(docRef, preferences);  // Store preferences in Firestore
        console.log('Preferences updated successfully!');
      } catch (error) {
        console.error('Error updating preferences:', error);
      }
    }
  },
        

    // Method to update user preferences in Firestore after they answer the questions
  
};
</script>


<style scoped>


#app {
    display: flex; 
    justify-content: center; 
    align-items: center; 
    position: relative; 
    width: 100%; 
    height: 100vh;
}


.fog-container {
    position: absolute; 
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 2; 
    top: 0; 
    pointer-events: none; 
}

.fog-img {
    position: absolute;
    height: 100vh; 
    width: 300vw; 
    z-index: 3; 
}


.fog-img-first {
background: url("/img2/fog-1.png");
background-repeat: repeat-x;
background-size: contain;
background-position: center;
animation: marquee 60s linear infinite;

}

.fog-img-second {
background: url("/img2/fog-2.png");
background-repeat: repeat-x;
background-size: contain;
background-position: center;
animation: marquee 30s linear infinite;
}

@keyframes marquee {
0% {
    transform: translate3d(0, 0, 0);
}

100% {
    transform: translate3d(-200vw, 0, 0);
}
}





.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute; 
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); 
    width: 100%; 
    height: 82%; 
    z-index: 5; 
}



.register {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden; 
}

.background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    background-position: center center;
    background-size: cover; 
    transition: opacity 1s ease-in-out; 
    z-index: 0; 
    
}

.background.fade-out {
    opacity: 0; 
}

.background.fade-in {
    opacity: 1; 
}




* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}


.login_wrap {
	width: 500px;
	margin: 0 auto;
	padding: 150px 0;
	position: relative;
    z-index: 4; 
}

.login_wrap .ring {
    width: 550px;
    height: 550px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.login_wrap .ring > i {
	border: 2px solid #ffffff;
	transition: .5s;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.login_wrap:hover .ring > i:nth-child(1) {
	border: 6px solid #9ef9fc;
	filter: drop-shadow( 0 0 20px #9ef9fc);
}

.login_wrap .ring > i:nth-child(1) {
	border-radius: 38% 62% 63% 37% / 41% 44% 56% 59%;
	animation: animate1 6s linear infinite;
}

.login_wrap:hover .ring > i:nth-child(2) {
	border: 6px solid #ff0057;
	filter: drop-shadow( 0 0 20px #ff0057);
}

.login_wrap .ring > i:nth-child(2) {
	border-radius: 41% 44% 56% 59% / 38% 62% 63% 37%;
	animation: animate1 6s linear infinite;
}

.login_wrap .ring > i:nth-child(3) {
	border-radius: 41% 44% 56% / 38% 62% 63% 37%;
	animation: animate2 6s linear infinite;
}

.login_wrap:hover .ring > i:nth-child(3) {
	border: 6px solid #d081f7;
	filter: drop-shadow( 0 0 20px #d081f7);
}





@keyframes animate1 {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}


@keyframes animate2 {
	0% {
		transform: rotate(360deg);
	}
	100% {
		transform: rotate(0deg);
	}
}


.login_wrap {
    position: relative; 
}


.playBut {
    display: flex; 
    justify-content: flex-end; 
    align-items: center;       
    position: absolute; 
    top: 620px; 
    right: 100px; 
    z-index: 4;
}

.playBut p {
    margin-right: 10px; 
}

img {
    width: 80px;
}

#icon{
    cursor: pointer;
}


.container {
    padding: 10px 10px;
    border-radius: 8px;
    width: 300px;
    text-align: center;
    background-color: rgba(128, 128, 128, 0.5);
    overflow: hidden; 
}




</style>