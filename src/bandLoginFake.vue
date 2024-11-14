<template>
  <div class="container-fluid d-flex align-items-center justify-content-center">
    <p>Sorry! This isn't implemented yet!</p>
    <button @click="goBack">Back</button>
  </div>
</template>

<script>
export default {
  name: "BandLogin2",
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

.container-fluid {
  background: linear-gradient(
    135deg,
    rgba(14, 0, 19, 0.85),
    rgba(17, 0, 36, 0.9)
  ); /* Dark purple */
  color: white;
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

p {
  font-size: 1.5em;
  text-align: center;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-family: "Poppins", sans-serif;
  background-color: white;
  color: #4b0082;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #6a0dad; /* Slightly lighter purple */
  color: white;
}
</style>
