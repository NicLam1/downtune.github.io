<template>
    <div class="container-fluid botwSection ">
        
        <div class="pt-4 botw row px-4 justify-content-center">
          <h1 class='text-center'>Bands of the Week</h1>
          <div class='item col-lg-2'><img src="../images/stock band/image1.jpg"
              class='object-fit-cover' alt> </div>
          <div class='item col-lg-2'><img src="../images/stock band/image2.jpg"
              class='object-fit-cover' alt></div>
          <div class='item col-lg-2'><img src="../images/stock band/image3.jpg"
              class='object-fit-cover' alt></div>
          <div class='item col-lg-2'><img src="../images/stock band/image4.jpg"
              class='object-fit-cover' alt></div>
          <div class='item col-lg-2'><img src="../images/stock band/image5.jpg"
              class='object-fit-cover' alt></div>
        </div>
      </div>
</template>

<script>
export default {
  name: 'Botw',
};
</script>

<style scoped>
*{
  color: #e0e0e0;
}
.botwSection{
    height: 80vh;
}
.botw {
  transform-style: preserve-3d;
  transform: perspective(1000px);
}
.botw  img {
  max-height: 100%;
}
.botw .item {
  transition: 0.5s;
  filter: brightness(0.2);
  padding: 2em;
  max-height: 60vh;
  overflow: hidden;
  cursor: pointer;
}

.botw  .item:hover {
  filter: brightness(1);
  transform: translateZ(200px);
}

.botw  .item:hover + * {
  filter: brightness(0.6);
  transform: translateZ(150px) rotateY(40deg);
}

.botw  .item:hover + * + * {
  filter: brightness(0.4);
  transform: translateZ(70px) rotateY(20deg);
}

.botw  .item:hover + * + * + * {
  filter: brightness(0.2);
  transform: translateZ(30px) rotateY(10deg);
}

.botw  .item:has(+ * :hover) {
  filter: brightness(0.6);
  transform: translateZ(150px) rotateY(-40deg);
}
.botw  .item:has(+ * + *:hover) {
  filter: brightness(0.4);
  transform: translateZ(70px) rotateY(-20deg);
}
.botw  .item:has(+ * + * + *:hover) {
  filter: brightness(0.2);
  transform: translateZ(30px) rotateY(-10deg);
}
</style>