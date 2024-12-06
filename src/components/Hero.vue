<script>
    export default {
        name: "Hero",
        methods: {
            scrollToRestaurants() {
                const section = document.querySelector(".restaurant-list");
                if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                }
            },
        },
    };
</script>

<template>
    <section class="hero">
        <div class="hero-content text-center">
            <h1 class="hero-title text-dark">Scopri i Migliori Ristoranti</h1>
            <p class="hero-description text-dark">
                Ordina il tuo cibo preferito dai migliori ristoranti vicino a te.
            </p>
            <button class="btn btn-primary btn-lg mt-3" @click="scrollToRestaurants">
                Esplora Ristoranti
            </button>
        </div>
    </section>
</template>

<style scoped>
    .hero {
        background-image: url('/src/assets/hero-bg-left.png'),
            /* Immagine a sinistra */
            url('/src/assets/hero-bg-top.jpg');
        /* Logo in alto a destra */
        background-size: 20%, 200px;
        /* Dimensione personalizzata per ogni immagine */
        background-position: right center, left top;
        /* Posizioni delle immagini */
        background-repeat: no-repeat, no-repeat;
        /* Nessuna ripetizione */

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
</style>