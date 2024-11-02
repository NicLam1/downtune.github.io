<template>
    <body>

        <div id="app">
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
                 

                    <div v-if="showLoginButtSection" class="buttonSection" :class="{ active: isActive }">
                        <div class="button__content">
                          <button class="button__text" @click="toggleSection()">Log In</button>
                          <i class="ri-arrow-right-circle-fill"></i>
                  
                          <div class="button__reflection-1"></div>
                          <div class="button__reflection-2"></div>
                        </div>
                  
                        <img src="./notesimg/note4.png" alt="" class="button__star-1">
                        <img src="./notesimg/note1.png" alt="" class="button__star-2">
                        <img src="./notesimg/note3.png" alt="" class="button__circle-1">
                        <img src="./notesimg/note2.png" alt="" class="button__circle-2">
                  
                        <div class="button__shadow"></div>

                        <div class="notes-container" ref="notesContainer"></div>
                        
                      </div>
                    
                    <div v-else>
                        <!-- Login Form Section -->
                        <div class="col-md-8 col-12 p-5 col-flex d-flex flex-column">
                            <h2 class="text-center text-dark fw-bold mb-4">Sign in to your account</h2>
                            <form @submit.prevent="handleSubmit" class="d-flex flex-column justify-content-center">
                            <div class="mb-3">
                                <label for="email-address" class="form-label">Email address</label>
                                <input type="email" id="email-address" v-model="email" name="email" class="form-control"
                                placeholder="Email address" required />
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" id="password" v-model="password" name="password" class="form-control"
                                placeholder="Password" required />
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
                    </div>
                </div>

            </div>
        </div>

        <div class="playBut">
            <img id="icon" src="./bandLoginImg/play.png" style="cursor: pointer;" @click="togglePlay()">
            <div class="soundWaves">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        </div>
    
        <audio id="mySong" src="/The Weeknd - Less Than Zero (Instrumental).mp3" loop ></audio>

    </div>


</body>
</template>

<script>


export default {
        data() {
            return {
            currentBackground: '/img2/gig.jpg', // Initial background image
            isFadingOut: false, // State for fading
            showLoginButtSection: true, 
            showLoginForm: true,
            isActive: false,
          
            
            };
        },

        computed: {
        buttonText() {
            return this.showLoginForm 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Login';
        }
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
    
        // click explore
        toggleSection() {

            this.isActive = true; // Trigger animation class
            this.$nextTick(() => {
            // Wait for the next DOM update cycle
            setTimeout(() => {
                this.showLoginButtSection = false; // Hide explore section after animation
                this.isActive = false; // Reset the active state after hiding
            }, 2000); // Delay to match animation duration
        });
        

        this.playMusicExplore();

        // notes explode
        const notesArray = ['🎵', '🎶', '🎤', '🎧', '🎸', '🎹']; // Array of musical note symbols
        const noteCount = 20; // Adjust the number of notes if needed

        // Center point for spreading out
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Modify just this part of your toggleSection method:
        for (let i = 0; i < noteCount; i++) {
            const note = document.createElement('span');
            note.classList.add('note');
            note.style.position = 'fixed'; // Change to fixed positioning
            note.style.zIndex = '1000';
            note.style.pointerEvents = 'none'; // Make sure notes don't block clicks
            
            // Randomly select a note from the notesArray
            note.innerText = notesArray[Math.floor(Math.random() * notesArray.length)];

            // Calculate random angle for spreading
            const angle = (i / noteCount) * 2 * Math.PI; // Spread evenly around the circle
            const distance = Math.random() * 200 + 100; // Random distance (100 to 300 pixels)

            // Calculate final position based on the angle and distance
            const x = centerX + distance * Math.cos(angle);
            const y = centerY + distance * Math.sin(angle);

            note.style.left = `${x}px`; // Set final position
            note.style.top = `${y}px`; // Set final position
            note.style.animationDelay = `${Math.random() * 2.0}s`; // Random delay for each note

            // Append the note to the body
            document.body.appendChild(note);

            // Remove note after animation ends
            note.addEventListener('animationend', () => {
                note.remove();
            });
        }

            },

        // show login or signup
        toggleForm() {
        this.showLoginForm = !this.showLoginForm; 
        },

        // login processing



        // -------------------------------------------------------------------------------------------
        // login decor

        // play music via login
        playMusicExplore() {
        const mySong = document.getElementById("mySong");
        const icon = document.getElementById("icon");
        const lines = document.querySelectorAll(".line");

        if (mySong.paused) {
            mySong.play().catch((error) => {
                console.error("Error playing audio:", error);
            });
            icon.src = "/img2/pause.png";
            lines.forEach((line) => {
                line.classList.add("active");
                const animation = this.getRandomAnimation();
                const duration = this.getRandomDuration();
                const delay = Math.random().toFixed(2);
                line.style.animation = `${animation} ${duration}s ease-in-out ${delay}s infinite`;
            });
            }
        },

        // play/pause music

        togglePlay() {
        const mySong = document.getElementById("mySong");
        const icon = document.getElementById("icon");
        const lines = document.querySelectorAll(".line");

        if (mySong.paused) {
            mySong.play();
            icon.src = "/img2/pause.png";
            lines.forEach((line) => {
            line.classList.add("active");
            const animation = this.getRandomAnimation();
            const duration = this.getRandomDuration();
            const delay = Math.random().toFixed(2);
            line.style.animation = `${animation} ${duration}s ease-in-out ${delay}s infinite`;
            });
        } else {
            mySong.pause();
            icon.src = "/img2/play.png";
            lines.forEach((line) => {
            line.classList.remove("active");
            line.style.animation = "none";
            });
        }
        },

        // wavesss

        getRandomAnimation() {
            const animations = ['waveMotion1', 'waveMotion2', 'waveMotion3', 'waveMotion4', 'waveMotion5'];
            return animations[Math.floor(Math.random() * animations.length)];
        },
        getRandomDuration() {
            return (Math.random() * 0.5 + 0.7).toFixed(2); 
        }


    }

}



</script>

<style>
/* explode */

@keyframes pop {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translateY(-50px) scale(1.5); 
        opacity: 0; 
    }
}

.note {
    position: absolute;
    font-size: 24px; 
    color: rgba(9, 237, 226, 0.7);
    animation: pop 2s forwards; 
    
}


.soundWaves {
    display: flex;
    align-items: flex-end;
    height: 50px;
    margin-left: 10px; 
    z-index: 4;
    gap: 2px;
    
}
.line {
    width: 12px;
    background-color: grey;
    margin-right: 2px;
    transition: height 0.2s ease;
    opacity: 0;
}
.line.active {
    opacity: 1;
}
@keyframes waveMotion1 { 0%, 100% { height: 20px; } 50% { height: 60px; } }
@keyframes waveMotion2 { 0%, 100% { height: 30px; } 50% { height: 80px; } }
@keyframes waveMotion3 { 0%, 100% { height: 10px; } 50% { height: 50px; } }
@keyframes waveMotion4 { 0%, 100% { height: 40px; } 50% { height: 70px; } }
@keyframes waveMotion5 { 0%, 100% { height: 16px; } 50% { height: 56px; } }


/* sign in/up global*/

.hidden {
    display: none;
}

.sub {
    width: 100%;
    padding: 10px;
    background-color: rgba(128, 128, 128, 0.8);  
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.sub:hover {
    background-color: rgba(128, 128, 128, 1.0); }

input, select {
    width: 100%;
    padding: 8px;
    margin-top: 5px !important;
    margin-bottom: 10px !important;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.9);
}

label {
    font-weight: bold;
    display: block;
    text-align: left;
    margin-bottom: 5px !important;
    color:black;}

.toggle-form {
    text-align: center;
    margin-top: 10px !important;
    cursor: pointer;
    color: #00ffee;  
    transition: color 0.3s ease;
}

.toggle-form:hover {
    color: #09cfb8;  
}


h2 {
    font-weight: bold;
    color: red; 
    font-size: 24px;
    margin-bottom: 20px !important;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* login button  */

:root {
 
 --gradient-color: linear-gradient(90deg,
                   hsl(180, 100%, 50%) 0%,
                   hsla(173, 99%, 50%, 0.486));
 --black-color: hsl(225, 15%, 6%);
 --reflection-color: hsla(53, 31%, 95%, 0.565);
 --body-color: hsl(48, 100%, 98%);
}


* {
 box-sizing: border-box;
 padding: 0;
 margin: 0;
}

</style>

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



body {
    font-family: Arial, sans-serif;
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



/* slide in */


.slide-in {
    transform: translateX(-100%); 
    animation: slideIn 2.0s forwards; 
}

.slide-out {
    transform: translateX(0); 
    animation: slideOut 2.0s forwards; 
}

@keyframes slideIn {
    from {
        transform: translateX(-100%); 
    }
    to {
        transform: translateX(0); 
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0); 
    }
    to {
        transform: translateX(-100%); 
    }
}

/* login butt */




.buttonSection {
  position: relative;
  transition: transform .4s;
  
  
}

.button__content {
  position: relative;
  background: var(--gradient-color);
  padding: 1.25rem 3rem;
  border-radius: 4rem;
  border: 3px solid var(--black-color);
  color: var(--black-color);
  display: flex;
  align-items: center;
  column-gap: .5rem;
  overflow: hidden;
}

.button__text {
  font-weight: 700;
  font-size: 20px;
  background: none; 
  border: none; 
  color: inherit; 
  cursor: pointer;
}

.button__icon {
  font-size: 1.5rem;
}

.button__text, 
.button__icon {
  position: relative;
  z-index: 2;
}

/* Reflection shapes */
.button__reflection-1, 
.button__reflection-2 {
  width: 8px;
  height: 120px;
  background-color: var(--reflection-color);
  rotate: 30deg;
  position: absolute;
  inset: 0;
  top: 0;
  left: -180%;
  margin: auto;
  transition: left .6s cubic-bezier(.2, .5, .2, 1.2);
}

.button__reflection-1::after {
  content: "";
  width: 26px;
  height: 100%;
  background-color: var(--reflection-color);
  position: absolute;
  top: -1rem;
  left: 1.25rem;
}

.button__reflection-2::after {
  content: "";
  width: 40px;
  height: 100%;
  background-color: var(--reflection-color);
  position: absolute;
  top: -1rem;
  left: .8rem;
}

.buttonSection img {
  position: absolute;
  opacity: 0;
  transition: transform .5s, opacity .5s;
  z-index: 3;
}

.ri-arrow-right-circle-fill{
    z-index: 3;
}

.button__star-1 {
  width: 50px;
  top: -14px;
  left: -16px;
  transform: rotate(48deg) scale(.1);
}

.button__star-2 {
  width: 50px;
  right: -10px;
  top: -4px;
  transform: rotate(-48deg) scale(.1);
}

.button__circle-1, 
.button__circle-2 {
  width: 40px;
}

.button__circle-1 {
  top: -8px;
  left: 58px;
  transform: scale(.1);
}

.button__circle-2 {
  right: 34px;
  bottom: -8px;
  transform: scale(.1);
}

.button__diamond {
  width: 18px;
  top: -18px;
  right: 62px;
  transform: scale(.1);
}




.button__shadow {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: var(--gradient-color);
  padding: 1.25rem 3rem;
  border-radius: 4rem;
  border: 3px solid var(--black-color);
  z-index: 1;
  transition: transform .5s;
}

.buttonSection.active .button__shadow {
    transform: translate(-.5rem, .5rem);
  }
  

  .buttonSection.active .button__reflection-1 {
    left: 120%;
  }
  
  .buttonSection.active .button__reflection-2 {
    left: -70%;
  }
  
  .buttonSection.active {
    transform: rotate(-4deg) scale(1.1);
  }
  
  .buttonSection.active img {
    opacity: 1;
  }
  
  .buttonSection.active .button__star-1 {
    transform: scale(0.8);
    transition-delay: .5s;
  }
  
  .buttonSection.active .button__star-2 {
    transform: scale(1.1);
    transition-delay: .3s;
  }
  
  .buttonSection.active .button__circle-1 {
    transform: translateY(-25px) scale(1.1);
    transition-delay: .5s;
  }
  
  .buttonSection.active .button__circle-2 {
    transform: translate(-20px, 20px) scale(1.1);
    transition-delay: .3s;
  }
  



</style>