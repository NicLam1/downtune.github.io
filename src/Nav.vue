<template>
  <nav class="navbar navbar-expand-lg custom-navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <span class="nav-title">Downtune</span>
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Discover</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Bands</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="../Calendar">Events</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="../userLogin.html">Contact</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Nav",
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");

.custom-navbar {
  background: linear-gradient(to right, #240244, #100014);
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  padding: 1em;
}

.nav-title {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  color: #feb47b; /* Using the accent color for a pop */
  font-size: 1.5rem;
}

.navbar-nav .nav-link {
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  color: #f0f0f0;
  margin: 0 0.8em;
  transition: color 0.3s;
}

.navbar-nav .nav-link:hover {
  color: #ff7e5f; /* A more noticeable color on hover */
}

.navbar-toggler {
  border: none;
  background-color: rgba(255, 255, 255, 0.3);
}

.navbar-toggler-icon {
  filter: invert(1);
}

@media (prefers-color-scheme: light) {
  .custom-navbar {
    background: linear-gradient(to right, #ffffff, #eeeeee);
  }
  .nav-title,
  .navbar-nav .nav-link {
    color: #213547;
  }
  .nav-link:hover {
    color: #747bff;
  }
}
</style>
