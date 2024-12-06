<script>
    import axios from "axios";

    export default {
        data() {
            return {
                dishes: [],
                loading: true,
            };
        },
        components: {
    
        },
        methods: {
            fetchDishes() {
                axios
                    .get("http://127.0.0.1:8000/api/dishes")
                    .then((response) => {
                        console.log("Risposta API piatti:", response.data);
                        this.dishes = response.data.results;
                    })
                    .catch((error) => {
                        console.error("Errore API piatti:", error);
                        this.error = "Errore nel caricamento dei dati.";
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
        },
        mounted() {
            this.fetchDishes();
        },
    };
</script>

<template>
    <div>
        <div class="container mt-4 restaurant-list">
            <h1 class="text-center">Lista dei Ristoranti</h1>
            <p v-if="loading" class="text-center">Caricamento in corso...</p>
            <p v-if="error" class="text-danger text-center">{{ error }}</p>
            <div v-if="!loading && !error" class="row">
                <div v-for="dish in dishes" :key="dish.id" class="col-md-4 mb-4">
                    <div class="restaurant-card">
                        <div class="restaurant-card-image" :style="{ backgroundImage: `url(${dish.image})` }">
                            <div class="restaurant-card-overlay">
                                <h5 class="restaurant-name">{{ dish.name }}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .restaurant-card {
        border: none;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .restaurant-card:hover {
        transform: translateY(-5px);
        box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    }

    .restaurant-card-image {
        height: 200px;
        background-size: cover;
        background-position: center;
        position: relative;
    }

    .restaurant-card-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        padding: 10px;
        text-align: center;
    }

    .restaurant-name {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0;
    }

    .restaurant-card-body {
        padding: 15px;
        background-color: #fff;
        border-top: 1px solid #f0f0f0;
    }

    .restaurant-card-body p {
        margin: 0 0 5px;
        font-size: 0.95rem;
    }
</style>