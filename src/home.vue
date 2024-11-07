<template>
<div class="p-lg-4">
    <Botw></Botw>
    <div class="container-fluid ">
      <Cards 
        :user-genres="preferences ? preferences.genres : []" 
        :user-pref-min-price="minPrice" 
        :user-pref-max-price="maxPrice" />
</div>
</div>
</template>

<script>
 import { auth, db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Botw from '../src/Botw.vue';
import Cards from '../src/Cards.vue';
export default {
    components: {
        Botw,Cards
    },
    data() {
        return {
            artists: [],
            preferences: null,
            minPrice: null,
            maxPrice: null,
        };
    },
    async mounted() {
        await this.getArtists();
    },
    mounted() {
      this.checkAuthState();
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
        },
        checkAuthState() {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            this.fetchUserPreferences(user.uid);
          } else {
            console.error("No user is currently signed in.");
          }
        });
      },
      async fetchUserPreferences(userId) {
        try {
          const docRef = doc(db, 'userPreferences', userId);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            this.preferences = docSnap.data();
            this.extractPriceRange(); // Extract price range when preferences are fetched
          } else {
            console.error('No preferences found for this user.');
          }
        } catch (error) {
          console.error('Error retrieving preferences:', error);
        }
      },
      extractPriceRange() {
      // Assuming preferences.budget is a string like "$1000-$1400 per hour"
      const budget = this.preferences?.budget || "";
      const priceMatch = budget.match(/\$(\d+)-\$(\d+)/);

        if (priceMatch) {
          this.minPrice = parseInt(priceMatch[1], 10);
          this.maxPrice = parseInt(priceMatch[2], 10);
        }
      },
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