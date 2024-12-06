<script>
import RestaurantCard from "./RestaurantCard.vue";
export default {
  name: "Hero",
  methods: {
    scrollToRestaurants() {
      const section = document.querySelector(".restaurant-list");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    },
    // ricarica la pagina
    reloadPage() {
      window.location.reload();
    },
  },
  data() {
    return {
      components: {
        RestaurantCard,
      },
    };
  },
};
</script>

<template>
  <section class="hero">
    <div class="hero-bg-left-clickable" @click="reloadPage"></div>
    <div class="hero-content text-center">
      <h1 class="hero-title text-dark">Scopri i migliori ristoranti</h1>
      <p class="hero-description text-dark">
        Ordina il tuo cibo preferito dai migliori ristoranti vicino a te.
      </p>
      <button class="btn btn-primary btn-lg mt-3" @click="scrollToRestaurants">
        Esplora Ristoranti
      </button>
    </div>
  </section>
  <section>
    <RestaurantCard />
  </section>
</template>

<style scoped>
.hero {
  /* Logo in alto a destra */
  background-image: url("/src/assets/hero-bg-left.png");
  /* Dimensione personalizzata per ogni immagine */
  background-size: 20%, 200px;
  /* Posizioni delle immagini */
  background-position: right center, left top;
  /* Nessuna ripetizione */
  background-repeat: no-repeat, no-repeat;
  margin: 20px;
  /* Sfondo fisso rispetto al viewport */
  padding: 100px 20px;
  text-align: center;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
  z-index: 2;
  /* Porta in primo piano il contenuto */
  position: relative;
  /* Necessario per z-index */
}

.hero-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
}

.hero-description {
  font-size: 1.2rem;
  margin-top: 10px;
  color: #555;
}

.hero-bg-left-clickable {
  background-image: url("/src/assets/hero-bg-top.jpg");
  background-repeat: no-repeat;
  background-size: 100%;
  margin: 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 10%;
  height: 10%;
  cursor: pointer;
}
</style>
