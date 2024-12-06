<script>
    import axios from "axios";

    export default {
        name: "Home",
        data() {
            return {
                restaurants: [],
                loading: true,
                error: null,
            };
        },
        methods: {
            fetchRestaurants() {
                axios
                    .get("http://127.0.0.1:8000/api/restaurants")
                    .then((response) => {
                        console.log("Risposta API:", response.data);
                        this.restaurants = response.data.results;
                    })
                    .catch((error) => {
                        console.error("Errore API:", error);
                        this.error = "Errore nel caricamento dei dati.";
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
        mounted() {
            this.fetchRestaurants();
        },
    };
</script>

<template>
    <div class="container mt-4">
        <h1 class="text-center">Lista dei Ristoranti</h1>
        <p v-if="loading" class="text-center">Caricamento in corso...</p>
        <p v-if="error" class="text-danger text-center">{{ error }}</p>

        <div v-if="!loading && !error" class="row">
            <div v-for="restaurant in restaurants" :key="restaurant.id" class="col-md-4">
                <div class="card mb-3">
                    <img :src="restaurant.image" class="card-img-top" :alt="restaurant.name">
                    <div class="card-body">
                        <h5 class="card-title text-center">{{ restaurant.name }}</h5>
                        <p class="card-text"><strong>Indirizzo:</strong>{{ restaurant.address }}</p>
                        <p class="card-text"><strong>Partita Iva:</strong>{{ restaurant.vat_number }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>