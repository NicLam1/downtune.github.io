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
          <div class="col">
            <div class="card shadow-sm">
              <img src="../images/image5.jpg" alt="Distraction" class="card-img-top">
              <div class="card-body">
                <p class="card-text">Distraction</p>
                <small class="text-muted">04:11</small>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card shadow-sm">
              <img src="../images/image5.jpg" alt="Homely" class="card-img-top">
              <div class="card-body">
                <p class="card-text">Homely</p>
                <small class="text-muted">05:10</small>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card shadow-sm">
              <img src="../images/image5.jpg" alt="Lonely" class="card-img-top">
              <div class="card-body">
                <p class="card-text">Lonely</p>
                <small class="text-muted">04:30</small>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card shadow-sm">
              <img src="../images/image5.jpg" alt="Soul" class="card-img-top">
              <div class="card-body">
                <p class="card-text">Soul</p>
                <small class="text-muted">04:50</small>
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
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  body {
    background-color: #f4f4f4; /* Light gray background */
    font-family: 'Poppins', sans-serif;
    margin: 0;
    color: #333; /* Dark gray text for better readability */
  }
  
  .container {
    padding: 2rem;
  }
  
  .title {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 1.5rem;
    color: #FF6F61; /* Coral color */
  }
  
  .description {
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 2rem;
    color: #666; /* Medium gray */
  }
  
  .band-photo {
    max-width: 100%;
    height: auto;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .subheading {
    font-size: 2rem;
    margin-top: 2rem;
    text-align: center;
    color: #FF6F61; /* Coral color */
  }
  
  .members-list {
    list-style-type: none;
    padding: 0;
    text-align: center;
  }
  
  .members-list .list-group-item {
    background-color: #2C3E50; /* Dark blue */
    color: #ffffff; /* White text */
    border: none;
    padding: 15px 20px;
    margin: 10px 0;
    border-radius: 8px;
  }
  
  .album {
    background-color: #3498DB; /* Bright blue */
    padding: 2rem 0;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  .album .card {
    border: none;
    border-radius: 12px;
    overflow: hidden;
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
    color: #2C3E50; /* Dark blue text */
  }
  
  .cta-title {
    font-size: 2.5rem;
    color: #FF6F61; /* Coral color */
    margin-bottom: 1rem;
  }
  
  .cta-description {
    font-size: 1.2rem;
    color: #666; /* Medium gray */
    margin-bottom: 2rem;
  }
  
  .btn-cta {
    background-color: #FF6F61; /* Coral */
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    transition: background-color 0.3s;
  }
  
  .btn-cta:hover {
    background-color: #E74C3C; /* Darker coral on hover */
  }
  </style>
  