<script>
    export default {
        name: "TrackingSection",
    };
</script>

<template>
    <section class="tracking-section py-5">
        <div class="container d-flex align-items-center flex-column flex-md-row">
            <div class="text-content text-center text-md-start">
                <h2 class="fw-bold mb-3">Segui gli ordini passo passo</h2>
                <p class="mb-4">
                    I piatti e i prodotti che ami, consegnati in pochissimo tempo. Vedrai quando il rider ha ritirato
                    l'ordine, potrai seguirlo passo passo, e riceverai una notifica quando sarà quasi da te.
                </p>
                <div class="d-flex justify-content-center justify-content-md-start">
                    <img src="/src/assets/app-store.png" alt="Scarica su App Store" class="store-badge me-3" />
                    <img src="/src/assets/google-play.png" alt="Disponibile su Google Play" class="store-badge" />
                </div>
            </div>
            <div class="map-content mt-4 mt-md-0 ms-md-5">
                <img src="/src/assets/map-min.png" alt="Tracking mappa" class="img-fluid" />
            </div>
        </div>
    </section>
</template>

<style scoped>
    .tracking-section {
        background-color: #f8f9fa;
        border-radius: 10px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        padding: 40px 20px;
    }

    .text-content {
        max-width: 500px;
    }

    .store-badge {
        height: 40px;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .store-badge:hover {
        transform: scale(1.1);
    }

    .map-content img {
        max-height: 300px;
        object-fit: cover;
        border-radius: 10px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    }
</style>