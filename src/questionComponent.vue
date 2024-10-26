<template>
  <div class="container w-75 text-center">
    <div class="question-container w-100 h-75">
      <h1 class="pt-4">{{title}}</h1>
      <div v-for="(option, index) in options" :key=index>
        <li>{{ option }}</li>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  props:['title', 'options'],
}
</script>
<style scoped>
.container{
  background-color: grey;
  height: 100vh;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.question-container{
  
  background-color: white;
}
</style>