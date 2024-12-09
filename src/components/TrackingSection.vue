<script>
export default {
  name: "TrackingSection",
};
</script>

<template>
  <section class="tracking-section py-5">
    <div class="container d-flex align-items-center flex-column flex-md-row">
      <div class="text-content text-center text-md-start">
        <h2 class="fw-bold mb-3 fs-3">Segui gli ordini passo passo</h2>
        <p class="mb-4 fs-6">
          I piatti e i prodotti che ami, consegnati in pochissimo tempo. Vedrai
          quando il rider ha ritirato l'ordine, potrai seguirlo passo passo, e
          riceverai una notifica quando sarà quasi da te.
        </p>
        <div class="d-flex justify-content-center justify-content-md-start">
          <img
            src="/src/assets/app-store.png"
            alt="Scarica su App Store"
            class="apple-badge me-3"
          />
          <img
            src="/src/assets/google-play.png"
            alt="Disponibile su Google Play"
            class="google-badge"
          />
        </div>
      </div>
      <div class="map-content mt-4 mt-md-0 ms-md-5">
        <img
          src="/src/assets/map-min.png"
          alt="Tracking mappa"
          class="img-fluid"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.tracking-section {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 40px 20px;
}

.text-content {
  max-width: 500px;
}

.apple-badge {
  height: 5vh;
  cursor: pointer;
  transition: transform 0.3s ease;
  margin-top: 4px;
}

.google-badge {
  height: 6.25vh;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.apple-badge:hover,
.google-badge:hover {
  transform: scale(1.1);
}

.map-content img {
  max-height: 300px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 12px 15px 14px rgba(0, 0, 0, 0.1);
}
</style>
