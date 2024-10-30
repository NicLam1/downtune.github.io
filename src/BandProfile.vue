<template>
  <main class="container">
    <h2 class="title">About Club Bandwagon</h2>
    <p class="description">Join us on an unforgettable musical journey. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <img src="../images/image5.jpg" alt="Band Photo" class="img-fluid band-photo">
    
    <h3 class="subheading">Band Members</h3>
    <ul class="list-group members-list">
      <li class="list-group-item">David Boll</li>
      <li class="list-group-item">Tan Peng</li>
      <li class="list-group-item">Pa</li>
      <li class="list-group-item">Ashraf</li>
    </ul>
  </main>

  <section class="album py-5">
    <div class="container">
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
        <div class="col" v-for="(album, index) in albums" :key="index">
          <div class="card shadow-sm rotate-animation">
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
    <h2 class="cta-title">Join the Club Mild Fanclub</h2>
    <p class="cta-description">Sign up for our email list to get exclusive updates, news, and special offers.</p>
    <form action="#">
      <div class="mb-3">
        <input type="email" class="form-control" id="emailInput" placeholder="Enter your email" required>
      </div>
      <button type="submit" class="btn btn-cta">Subscribe</button>
    </form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      albums: [
        { image: '../images/image5.jpg', title: 'Distraction', duration: '04:11' },
        { image: '../images/image5.jpg', title: 'Homely', duration: '05:10' },
        { image: '../images/image5.jpg', title: 'Lonely', duration: '04:30' },
        { image: '../images/image5.jpg', title: 'Soul', duration: '04:50' }
      ]
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

body {
  background-color: #ffedda;
  font-family: 'Poppins', sans-serif;
  margin: 0;
  color: #333;
}

.title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #ff6f61;
  font-family: 'Playfair Display', serif;
}

.description {
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #444;
}

.band-photo {
  max-width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.subheading {
  font-size: 2rem;
  margin-top: 2rem;
  text-align: center;
  color: #ff6f61;
}

.members-list {
  list-style-type: none;
  padding: 0;
  text-align: center;
}

.members-list .list-group-item {
  background: rgba(255, 255, 255, 0.9);
  color: #2c3e50;
  border: none;
  padding: 15px 20px;
  margin: 10px 0;
  border-radius: 8px;
  transition: transform 0.3s;
}

.members-list .list-group-item:hover {
  transform: scale(1.05);
}

.album {
  background-color: #f67280;
  padding: 2rem 0;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.album .card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.6s;
}

.rotate-animation {
  animation: rotate 8s infinite linear;
}

@keyframes rotate {
  0% {
    transform: rotateY(0deg) rotateX(0deg);
  }
  25% {
    transform: rotateY(90deg) rotateX(10deg);
  }
  50% {
    transform: rotateY(180deg) rotateX(0deg);
  }
  75% {
    transform: rotateY(270deg) rotateX(-10deg);
  }
  100% {
    transform: rotateY(360deg) rotateX(0deg);
  }
}

.album .card-img-top {
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s;
}

.album .card:hover .card-img-top {
  transform: scale(1.05);
}

.album .card-text {
  font-size: 1.2rem;
  font-weight: 500;
  color: #2c3e50;
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
