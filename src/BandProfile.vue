<template>
    <main class="container py-5">
      <h2 class="title">About Club Bandwagon</h2>
      <p class="description">Join us on an unforgettable musical journey. Experience the rhythm of our vibes as we blend genres and create unforgettable melodies.</p>
      <img src="../images/stock band/image5.jpg" alt="Band Photo" class="img-fluid band-photo mb-5">
      
      <h3 class="subheading">Band Members</h3>
      <ul class="list-group members-list mb-5">
        <li class="list-group-item" v-for="member in bandMembers" :key="member">{{ member }}</li>
      </ul>
    </main>
  
    <section class="album py-5">
      <div class="container">
        <h3 class="subheading mb-4">Our Soundtracks</h3>
        <div class="album-scroll" ref="albumScroll">
          <div class="album-item" v-for="(album, index) in albums" :key="index">
            <div class="card shadow-sm">
              <img :src="album.image" :alt="album.title" class="card-img-top">
              <div class="card-body">
                <p class="card-text">{{ album.title }}</p>
                <small class="text-muted">{{ album.duration }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <section class="call-to-action text-center py-5">
      <div class="container">
        <h2 class="cta-title">Join the Club Mild Fanclub</h2>
        <p class="cta-description">Sign up for our email list to get exclusive updates, news, and special offers.</p>
        <form @submit.prevent="submitForm" class="mx-auto" style="max-width: 400px;">
          <div class="mb-3">
            <input v-model="email" type="email" class="form-control" id="emailInput" placeholder="Enter your email" required>
          </div>
          <button type="submit" class="btn btn-cta">Subscribe</button>
        </form>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const bandMembers = ['David Boll', 'Tan Peng', 'Pa', 'Ashraf']
  
  const albums = [
    { image: '../images/stock band/image1.jpg', title: 'Distraction', duration: '04:11' },
    { image: '../images/stock band/image3.jpg', title: 'Homely', duration: '05:10' },
    { image: '../images/stock band/image4.jpg', title: 'Lonely', duration: '04:30' },
    { image: '../images/stock band/image6.jpg', title: 'Soul', duration: '04:50' },
    { image: '../images/stock band/image5.jpg', title: 'Echoes', duration: '03:55' },
    { image: '../images/stock band/image2.jpg', title: 'Whisper', duration: '04:22' }
  ]
  
  const email = ref('')
  
  const submitForm = () => {
    console.log('Submitted email:', email.value)
    alert('Thanks for subscribing!')
    email.value = ''
  }
  
  const startInfiniteScroll = () => {
    const albumScroll = document.querySelector('.album-scroll');
    const scrollStep = 1; // Adjust for scrolling speed
  
    if (albumScroll) {
      const cloneAlbums = () => {
        const items = albumScroll.querySelectorAll('.album-item');
        items.forEach(item => {
          const clone = item.cloneNode(true);
          albumScroll.appendChild(clone);
        });
      }
  
      cloneAlbums(); // Clone album items to create seamless scroll
  
      const scroll = () => {
        if (albumScroll.scrollLeft >= albumScroll.scrollWidth / 2) {
          albumScroll.scrollLeft = 0;
        } else {
          albumScroll.scrollLeft += scrollStep;
        }
        requestAnimationFrame(scroll);
      };
      scroll();
    }
  }
  
  onMounted(() => {
    startInfiniteScroll();
  })
  </script>
  
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
  
  body {
    background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
    color: #333;
    font-family: 'Poppins', sans-serif;
    margin: 0;
  }
  
  .title, .subheading {
    font-family: 'Playfair Display', serif;
    color: #ff6f61;
    text-align: center;
  }
  
  .title {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
  
  .subheading {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .description {
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 2rem;
    color: #444;
  }
  
  .band-photo {
    border-radius: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .members-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
  }
  
  .members-list .list-group-item {
    width: 60%;
    background: rgba(255, 255, 255, 0.9);
    color: #2c3e50;
    border: none;
    padding: 15px 20px;
    margin: 5px 0;
    border-radius: 8px;
    transition: transform 0.8s;
    text-align: center;
    transform-style: preserve-3d;
  }
  
  .members-list .list-group-item:hover {
    transform: rotateY(180deg);
    background-color: #ff6f61;
    color: #fff;
  }
  
  .album {
    background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
    overflow: hidden;
    padding: 4rem 0;
    border-radius: 15px;
  }
  
  .album-scroll {
    display: flex;
    overflow-x: hidden;
    gap: 20px;
  }
  
  .album-item {
    flex: 0 0 auto;
    width: 250px;
  }
  
  .card {
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s;
  }
  
  .card:hover {
    transform: scale(1.05);
  }
  
  .card-img-top {
    height: 200px;
    object-fit: cover;
    border-radius: 12px 12px 0 0;
  }
  
  .cta-title {
    font-size: 2.5rem;
    color: #ff6f61;
    margin-bottom: 1rem;
    font-family: 'Playfair Display', serif;
  }
  
  .cta-description {
    font-size: 1.2rem;
    color: #444;
    margin-bottom: 2rem;
  }
  
  .btn-cta {
    background-color: #ff6f61;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    transition: background-color 0.3s;
  }
  
  .btn-cta:hover {
    background-color: #e74c3c;
  }
  </style>
  