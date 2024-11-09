<template>
  <div class="backgroundPic">
    <div class="container-fluid botwSection">
      <!-- Grid view for large screens -->
      <div
        class="pt-3 botw row px-5 justify-content-center d-none d-lg-flex mb-5"
      >
        <div class="title">
          <h1
            class="text-center botw-heading animate__animated animate__zoomIn"
          >
            Bands of the Week
          </h1>
        </div>

        <div class="item col-lg-2" v-for="(band, index) in bands" :key="index">
          <div class="image-container">
            <img :src="band.image" alt="" />
            <div class="caption">
              <h3>{{ band.name }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel for smaller screens -->
      <div
        id="botwCarousel"
        class="carousel slide d-lg-none"
        data-bs-ride="carousel"
      >
        <h1 class="text-center botw-heading">Bands of the Week</h1>
        <div class="carousel-inner">
          <div
            class="carousel-item"
            v-for="(band, index) in bands"
            :key="'carousel-' + index"
            :class="{ active: index === 0 }"
          >
            <div class="image-container">
              <img :src="band.image" class="d-block w-100" alt="" />
              <div class="caption">
                <h3>{{ band.name }}</h3>
              </div>
            </div>
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#botwCarousel"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#botwCarousel"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>

    <!-- Blinking Arrow -->
    <div class="scroll-arrow mb-4" @click="scrollToNext">
      <span class="arrow"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Botw",
  data() {
    return {
      bands: [
        { name: "Band One", image: "/stock band/image (1).webp" },
        { name: "Band Two", image: "/stock band/image (2).webp" },
        { name: "Band Three", image: "/stock band/image (3).webp" },
        { name: "Band Four", image: "/stock band/image (4).webp" },
        { name: "Band Five", image: "/stock band/image (5).webp" },
      ],
    };
  },
  methods: {
    scrollToNext() {
      const nextElement = this.$el.nextElementSibling;
      if (nextElement) {
        nextElement.scrollIntoView({ behavior: "smooth" });
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Fugaz+One&display=swap");
@import url("https://fonts.googleapis.com/css?family=Cairo");

@font-face {
  font-family: Trends;
  src: url(/fonts/Trends.ttf);
}

.backgroundPic {
  background-image: url("/stock band/botw.jpg");
  background-position: center center;
  background-size: cover;
  z-index: -99;
}
.botwSection {
  margin-top: 0;
  background: rgba(57, 0, 59, 0.606);
  padding: 40px 0;
  position: relative;
  overflow: hidden;
  object-fit: cover;
  background-repeat: none;
  backdrop-filter: blur(20px);
  height: 89vh;
}

.title {
  font-family: "Trends";
  font-weight: bolder;
  text-align: center;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  letter-spacing: 1px;
  line-height: 2;
}

h1 {
  background-image: url(https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjltcjM2bHk1NHpncXJuamd5bm81dGl2aTA4ODBta2djdnN5MWcxeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/84Ppz0cXydbICAgZXC/giphy.gif);

  background-repeat: none;
  background-size: contain;
  color: transparent;
  /* color: white; */
  -moz-background-clip: text;
  -webkit-background-clip: text;
  text-transform: uppercase;
  font-size: clamp(2em, 8vw, 10em); /* Responsive font size */
  margin: 10px 0;
  font-family: "Trends";
}

/* Blinking Arrow */
.scroll-arrow {
  z-index: 0;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  animation: blink 1.5s infinite;
}

.arrow {
  display: inline-block;
  border: solid #fff;
  border-width: 0 5px 5px 0;
  padding: 10px;
  transform: rotate(45deg);
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* Other existing styles */
.botw {
  transform-style: preserve-3d;
  transform: perspective(1000px);
}

.botw .item {
  transition: 0.4s;
  filter: brightness(0.8);
  padding: 1em;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.botw .item:hover {
  filter: brightness(1);
  transform: translateZ(150px);
}

.botw .item:hover + * {
  filter: brightness(0.6);
  transform: translateZ(100px) rotateY(30deg);
}

.botw .item:hover + * + * {
  filter: brightness(0.4);
  transform: translateZ(50px) rotateY(10deg);
}

.botw .item:hover + * + * + * {
  filter: brightness(0.2);
  transform: translateZ(20px) rotateY(5deg);
}

.botw .item:has(+ * :hover) {
  filter: brightness(0.6);
  transform: translateZ(100px) rotateY(-30deg);
}
.botw .item:has(+ * + *:hover) {
  filter: brightness(0.4);
  transform: translateZ(50px) rotateY(-10deg);
}
.botw .item:has(+ * + * + *:hover) {
  filter: brightness(0.2);
  transform: translateZ(20px) rotateY(-5deg);
}

.image-container {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  height: 400px;
  box-shadow: #ff00ff;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.caption {
  font-family: "Poppins";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(26, 0, 38, 0.7);
  color: #fff;
  padding: 10px;
  text-align: center;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.5s;
}

.image-container:hover .caption {
  opacity: 1;
  transform: translateY(0);
}

.caption h3 {
  margin: 0;
  font-family: "Fugaz One";
  animation: captionGlow 2s infinite alternate;
}

@keyframes captionGlow {
  0% {
    text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff;
  }
  100% {
    text-shadow: 0 0 15px #ff00ff, 0 0 20px #ff00ff;
  }
}

/* Carousel Styles */
#botwCarousel .carousel-inner,
#botwCarousel .carousel-item,
#botwCarousel .image-container {
  height: 400px; /* Consistent height */
}

#botwCarousel .image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Center carousel controls vertically */
#botwCarousel .carousel-control-prev,
#botwCarousel .carousel-control-next {
  top: 50%;
  transform: translateY(-50%);
  width: 5%;
}

/* Ensure the caption is always visible in the carousel */
#botwCarousel .caption {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive adjustments */
@media (min-width: 992px) {
  /* Hide carousel on large screens */
  #botwCarousel {
    display: none;
  }
}

@media (max-width: 991px) {
  /* Hide grid on small screens */
  .botw {
    display: none;
  }
}

/* Adjust padding on smaller screens */
@media (max-width: 600px) {
  .botwSection {
    padding: 20px 0;
  }
}
</style>
