<template>
<div class="p-lg-4">
    <Botw></Botw>
    <div class="container-fluid ">
    <Cards></Cards>
</div>
</div>
</template>

<script>
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Botw from '../src/Botw.vue';
import Cards from '../src/Cards.vue';
export default {
    components: {
        Botw,Cards
    },
    data() {
        return {
            artists: []
        };
    },
    async mounted() {
        await this.getArtists();
    },
    methods: {
        async getArtists() {
            const bandCollectionRef = collection(db, 'artists');
            try {
                const querySnapshot = await getDocs(bandCollectionRef);
                querySnapshot.forEach((doc) => {
                    this.artists.push({ id: doc.id, ...doc.data() });
                });
                console.log(this.artists);
            } catch (error) {
                console.error("Error fetching artists:", error);
            }
        }
    }
};
</script>

<style scoped>
@import './style.css';
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

#app {
    font-family: 'Poppins', sans-serif;

}
</style>