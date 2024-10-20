<template>
  <div class="backgroundMain d-flex justify-content-center align-items-center w-100">
    <div class="container min-h-screen d-flex justify-content-center align-items-center">
      <div class="card w-100 h-100 shadow-lg overflow-hidden">
        <div class="row g-0 h-100">
          <!-- Login Form Section -->
          <div class="col-md-8 col-12 p-5 col-flex d-flex flex-column">
            <h2 class="text-center text-dark fw-bold mb-4">Register</h2>
            <form @submit.prevent="handleSubmit" class="d-flex flex-column justify-content-center">
              <div class="mb-3">
                <label for="email-address" class="form-label sr-only">Email address</label>
                <input type="email" id="email-address" name="email" class="form-control" placeholder="Email address" required />
              </div>
              <div class="mb-3">
                <label for="username" class="form-label sr-only">Username</label>
                <input type="text" id="username" name="username" class="form-control" placeholder="Username" required />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label sr-only">Password</label>
                <input type="password" id="password" name="password" class="form-control" placeholder="Password" required />
              </div>
              <div class="mb-3">
                <label for="password-confirm" class="form-label sr-only">Confirm Password</label>
                <input type="password" id="password-confirm" name="password-confirm" class="form-control" placeholder="Confirm Password" required />
              </div>
              <button type="submit" class="btn btn-primary w-100">Sign in</button>
            </form>
            <p class="text-center mt-3">
              Have an account? <a href="../userLogin.html" class="text-primary">Sign In</a>
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
export default {
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false
    };
  },
  methods: {
    handleSubmit() {
      // Handle form submission
      console.log("Email:", this.email);
      console.log("Password:", this.password);
      console.log("Remember me:", this.rememberMe);
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
  background-color: rgb(7, 0, 19);
}
</style>

<!-- Bootstrap -->



