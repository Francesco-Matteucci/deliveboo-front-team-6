<script>
import axios from "axios";
import 'bootstrap-icons/font/bootstrap-icons.css';
export default {
    data() {
        return {
            restaurants: [],
            filteredRestaurants: [],
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
        fetchRestaurants() {
            const restaurantId = this.$route.params.id;
            axios
                .get("http://127.0.0.1:8000/api/restaurants")
                .then((response) => {
                    console.log("Risposta API Ristoranti:", response.data);
                    this.restaurants = response.data.results;
                    this.filteredRestaurants = this.restaurants.filter(
                        (restaurant) => restaurant.id === parseInt(restaurantId)
                    );
                })
                .catch((error) => {
                    console.error("Errore API Ristoranti:", error);
                    this.error = "Errore nel caricamento dei dati.";
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    },
    mounted() {
        this.fetchDishes();
        this.fetchRestaurants();
    },
};
</script>

<template>
    <header class="hero-banner position-relative w-100" :style="{ backgroundImage: `url(${filteredRestaurants[0]?.image})` }">
    <!-- Hero Content -->
    <div class="hero-overlay position-absolute top-0 start-0 d-flex p-4">
        <div class="info-box bg-dark bg-opacity-75 text-white p-4 rounded">
            <h1 class="fw-bold">{{ filteredRestaurants[0]?.name }}</h1>
            <p class="mb-2">
                <i class="bi bi-geo-alt-fill text-danger me-2"></i>
                {{ filteredRestaurants[0]?.address }}
            </p>
            <p>
                <i class="bi bi-tags-fill text-secondary me-2"></i>
                Categorie:
                <span v-for="(category, index) in filteredRestaurants[0]?.categories" :key="category.id">
                    <strong>{{ category.name }}</strong>
                    <span v-if="index < filteredRestaurants[0]?.categories.length - 1">, </span>
                </span>
            </p>
        </div>
    </div>
</header>

    <main>
        <!--Dishes-->
        <div class="container p-5 dish-container">
            <p v-if="loading" class="text-center">Caricamento in corso...</p>
            <p v-if="error" class="text-danger text-center">{{ error }}</p>
            <div v-if="!loading && !error"
                class="dish-list row p-5 align-items-center d-flex justify-content-center rounded-5">
                <div v-for="dish in filteredDishes" :key="dish.id" class="col-md-4 mb-4">
                    <div class="dish-card align-items-center">
                        <div class="dish-card-image" :style="{ backgroundImage: `url(${dish.image})` }">
                            <div class="dish-card-overlay">
                                <h3 class="fw-semibold m-0">{{ dish.name }}</h3>
                            </div>
                        </div>
                        <!--Card hoover-->
                        <div
                            class="dish-card-back justify-content-center text-white text-center align-items-center fw-semibold">
                            <p class="fs-4 dish-title-description p-2 rounded-2 align-items-center p-0">{{ dish.name }}
                            </p>
                            <div class="dish-description">
                                {{ dish.description }}
                            </div>
                        </div>
                    </div>
                    <!--Card dishes-->
                    <div class="d-flex gap-2 mt-2 justify-content-center align-items-center">
                        <div>
                            <span v-if="dish.visible" class="text-success rounded-2 fw-semibold">
                                <i class="bi bi-bag-check-fill me-3"> Disponibile</i>
                                <button type="button" class="badge add-to-cart-button">
                                    <span><i class="bi bi-cart-plus fs-5"></i>{{ dish.price }} €</span>
                                </button>
                            </span>
                            <span v-else class="text-danger rounded-2 fw-semibold">
                                <i class="bi bi-bag-x-fill me-3"> Non disponibile</i>
                                <button type="button" class="badge add-to-cart-button not-available">
                                    {{ dish.price }} €
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>


<style scoped>
.hero-banner {
    height: 70vh;
    background-size: cover;
    background-position: center;
    position: relative;
    color: #fff;
}

.hero-overlay {
    background: rgba(0, 0, 0, 0.5);
}

.info-box {
    max-width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/*Restaurants*/

.restaurant-card {
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.restaurant-card:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
}

.restaurant-banner {
    height: 200px;
    background-size: cover;
    background-position: center;
    position: relative;
}

.restaurant-overlay {
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.restaurant-details {
    background: #fff;
    padding: 20px;
    border-top: 2px solid #ddd;
}

.restaurant-details h2 {
    font-size: 1.5rem;
}

.restaurant-details p {
    font-size: 1rem;
    line-height: 1.5;
}

.restaurant-description {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #6c757d;
}

/*Dishes*/

.dish-list {
    background-color: rgba(240, 240, 240, 0.404);
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

    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.5);
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

.not-available {
    color: #e2e2e2;
    cursor: not-allowed;
    pointer-events: none;
    opacity: 1;
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

.add-to-cart-button {
    background-color: #ff6403;
    border: #ff6403;
}

.add-to-cart-button:hover {
    scale: 1.1;
}

.dish-view-description {
    padding: 10px;
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
    background-color: #ff6403;
    border-radius: 10px;
}

.dish-description::-webkit-scrollbar-thumb:hover {
    background-color: #ff6403;
}

.dish-description::-webkit-scrollbar-track {
    background: #2e2e2e;
    border-radius: 10px;
}
</style>