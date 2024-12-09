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
      <h1 class="hero-title text-white fs-3">Scopri i migliori ristoranti</h1>
      <p class="hero-description text-white fs-5">
        Ordina il tuo cibo preferito dai migliori ristoranti vicino a te.
      </p>
      <button class="btn-lg mt-2 text-white fs-5" @click="scrollToRestaurants">
        Iniziamo!
      </button>
    </div>
    <div class="overlay"></div>
  </section>
  <video
    class="video-background"
    src="/src/assets/video/3944332-uhd_4096_2160_25fps.mp4"
    autoplay
    muted
    loop
  ></video>
  <section>
    <RestaurantCard />
  </section>
</template>

<style scoped>
.hero {
  /* Logo in basso a destra */
  /* background-image: url("/src/assets/hero-bg-left.png"), */
  /* url("/src/assets/hero-bg-right.png"), url("/src/assets/fries.png"); */
  /* Dimensione personalizzata per ogni immagine */
  background-size: 20%, 30%, 20%;
  object-fit: cover;
  background-position: right bottom, right top, left bottom;
  background-repeat: no-repeat;
  padding: 100px 20px;
  text-align: center;
  height: 100vh;
  align-items: center;
  display: flex;
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
  background-image: url("/src/assets/logo-deliveboo.webp");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  margin-top: 1vw;
  position: absolute;
  top: 0;
  left: 0;
  width: 15vw;
  height: 20vh;
  cursor: pointer;
}

button {
  padding: 3px 15px;
  border-radius: 13px;
  background-color: #ff6204;
  border: none;
  &:hover {
    scale: 1.1;
  }
  &:active {
    scale: 1;
  }
}

.video-background {
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -2;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.66);
  z-index: -1;
}
</style>
