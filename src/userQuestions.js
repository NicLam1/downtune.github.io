import { createApp } from 'vue';
import './style.css';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import questionContainer from './questionContainer.vue';
import { MotionPlugin } from '@vueuse/motion';

const app = createApp(questionContainer); 

app.use(MotionPlugin); 

app.mount('#app'); 
