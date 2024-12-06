<script>
import axios from "axios";
import 'bootstrap-icons/font/bootstrap-icons.css';
export default {
    data() {
        return {
            dishes: [],
            filteredDishes: [],
            loading: true,
            error: null,
        };
    },
    methods: {
        fetchDishes() {
            const restaurantId = this.$route.params.id;
            axios
                .get("http://127.0.0.1:8000/api/dishes")
                .then((response) => {
                    console.log("Risposta API piatti:", response.data);
                    this.dishes = response.data.results;
                    this.filteredDishes = this.dishes.filter((dish) => dish.restaurant_id === parseInt(restaurantId)
                    );
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
        <div class="container p-5 dish-container">
            <p v-if="loading" class="text-center">Caricamento in corso...</p>
            <p v-if="error" class="text-danger text-center">{{ error }}</p>
            <div v-if="!loading && !error" class="dish-list row p-5 align-items-center d-flex justify-content-center rounded-5">
                <div v-for="dish in filteredDishes" :key="dish.id" class="col-md-4 mb-4">
                    <div class="dish-card align-items-center">
                        <div class="dish-card-image" :style="{ backgroundImage: `url(${dish.image})` }">
                            <div class="dish-card-overlay">
                                <h3 class="fw-semibold m-0">{{ dish.name }}</h3>
                            </div>
                            <div>
                                <div class="badge dish-badge">
                                    {{ dish.price }} €
                                </div>
                                <div class="badge dish-view-description">
                                    Descrizione
                                </div>
                            </div>
                            <span v-if="dish.visible" class="ms-2 text-success">
                                <i class="fs-2 bi bi-bag-check-fill"></i>
                            </span>
                            <span v-else class="ms-2 text-danger">
                                <i class="fs-2 bi bi-bag-x-fill"></i>
                            </span>
                        </div>
                        <div class="dish-card-back justify-content-center text-white text-center align-items-center fw-semibold">
                            <p class="fs-4 dish-title-description p-2 rounded-2 align-items-center p-0">Descrizione del piatto</p>
                            <div class="dish-description">
                                {{ dish.description }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>

    .dish-list{
        background-color: rgba(255, 166, 0, 0.400);
    }

    .dish-card {
        position: relative;
        border: none;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .dish-card:hover {
        transform: translateY(-5px);
        box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    }

    .dish-card-image {
        height: 200px;
        background-size: cover;
        background-position: center;
        position: relative;
        transition: opacity 0.3s ease;
    }

    .dish-card-back {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        padding: 15px;
        opacity: 0;
        transition: opacity 0.3s ease;
        border-radius: 10px;
    }

    .dish-card-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.4);
        color: #fff;
        padding: 10px;
        text-align: center;
    }

    .dish-badge{
        position: absolute;
        bottom: 10px;
        right: 10px;
        padding: 10px;
        background-color: rgb(197, 148, 57);
    }

    .dish-view-description{
        position: absolute;
        bottom: 10px;
        left: 10px;
        padding: 10px;
        background-color: rgb(197, 148, 57);
    }

    .dish-card:hover .dish-card-image {
        opacity: 0;
    }

    .dish-card:hover .dish-card-back {
        opacity: 1;
    }
    .dish-description {
        max-height: 100px;
        overflow-y: auto;
        padding: 10px;
        border-radius: 5px; 
        color: #fff;
        text-align: left; 
    }

    .dish-description::-webkit-scrollbar {
        width: 8px;
    }

    .dish-description::-webkit-scrollbar-thumb {
        background-color: #c59439;
        border-radius: 10px;
    }

    .dish-description::-webkit-scrollbar-thumb:hover {
        background-color: #e3b15e;
    }

    .dish-description::-webkit-scrollbar-track {
        background: #2e2e2e;
        border-radius: 10px;
    }
</style>