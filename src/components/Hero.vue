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
        background-image: url('/src/assets/hero-bg-right.png');
        background-size: contain;
        background-position: right;
        background-repeat: no-repeat;
        padding: 100px 20px;
        color: #fff;
        text-align: center;
    }

    .hero-content {
        max-width: 600px;
        margin: 0 auto;
    }

    .hero-title {
        font-size: 2.5rem;
        font-weight: bold;
    }

    .hero-description {
        font-size: 1.2rem;
        margin-top: 10px;
    }
</style>