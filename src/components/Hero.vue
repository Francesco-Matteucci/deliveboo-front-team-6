<script>
import RestaurantCard from "./RestaurantCard.vue";
export default {
  name: "Hero",
  methods: {
    scrollToRestaurants() {
      const section = document.querySelector(".categories-container");
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
    <div class="hero-content text-center mt-5">
      <h1 class="hero-title text-dark fs-3">Scopri i migliori ristoranti</h1>
      <p class="hero-description text-dark fs-5">
        Ordina il tuo cibo preferito dai migliori ristoranti vicino a te.
      </p>
      <button class="btn btn-primary btn-lg mt-2" @click="scrollToRestaurants">
        Iniziamo!
      </button>
    </div>
  </section>
  <section>
    <RestaurantCard />
  </section>
</template>

<style scoped>
.hero {
  /* Logo in basso a destra */
  background-image: url("/src/assets/hero-bg-left.png"),
    url("/src/assets/hero-bg-right.png"), url("/src/assets/fries.png");
  /* Dimensione personalizzata per ogni immagine */
  background-size: 20%, 30%, 20%;

  object-fit: cover;
  /* Posizioni delle immagini */
  background-position: right bottom, right top, left bottom;
  /* Nessuna ripetizione */
  background-repeat: no-repeat;
  /* Sfondo fisso rispetto al viewport */
  padding: 100px 20px;
  text-align: center;
  height: 100vh;
  align-items: center;
  display: flex;
  background-color: rgb(241, 233, 233);
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
  z-index: 3;
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
  background-image: url("/src/assets/deliveroo-1.svg");
  background-repeat: no-repeat;
  background-size: 100%;
  margin: 20px 30px;
  position: absolute;
  top: 0;
  left: 0;
  width: 15%;
  height: 15%;
  cursor: pointer;
}

.btn {
  padding: 1vh 2vh;
  border-radius: 1rem;
  &:hover {
    scale: 1.1;
  }
  &:active {
    scale: 1;
  }
}
</style>
