<script>
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import Footer from "../components/Footer.vue";

export default {
    components: {
        Footer,
    },
    data() {
        return {
            restaurants: [],
            filteredRestaurants: [],
            dishes: [],
            filteredDishes: [],
            cart: [],
            total: 0,
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
                    this.filteredDishes = this.dishes.filter(
                        (dish) => dish.restaurant_id === parseInt(restaurantId)
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
        },
        addToCart(dish) {
            this.cart.push(dish);
            this.total += parseFloat(dish.price);
            this.total = parseFloat(this.total.toFixed(2));
        },

        removeFromCart(index) {
            const removedDish = this.cart.splice(index, 1)[0];
            this.total -= parseFloat(removedDish.price);
            this.total = parseFloat(this.total.toFixed(2));
        },
    },
    mounted() {
        this.fetchDishes();
        this.fetchRestaurants();
    },
};
</script>

<template>
    <header class="hero-banner position-relative w-100 m-0"
        :style="{ backgroundImage: `url(${filteredRestaurants[0]?.image})` }">
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
                        <span v-if="index < filteredRestaurants[0]?.categories.length - 1">,
                        </span>
                    </span>
                </p>
            </div>
        </div>
    </header>

    <main class="pt-4">
        <!--Cart-->
        <div class="cart ">
            <h4 class="text-center mb-4">
                <i class="bi bi-cart4"></i> Carrello
            </h4>

            <ul class="list-unstyled">
                <li v-for="(item, index) in cart" :key="index"
                    class="cart-item d-flex justify-content-between align-items-center py-3 px-4 mb-3 rounded-3 shadow-sm bg-light">
                    <div class="d-flex align-items-center">
                        <span class="fw-semibold">{{ item.name }}</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="me-3">{{ item.price }} €</span>
                        <button @click="removeFromCart(index)" class="btn btn-sm btn-outline-danger">
                            Rimuovi
                        </button>
                    </div>
                </li>
            </ul>

            <p v-if="cart.length === 0" class="text-center text-muted">
                Il carrello è vuoto.
            </p>

            <div v-if="cart.length > 0" class="d-flex justify-content-between align-items-center">
                <h5 class="fw-semibold">Totale: {{ total }} €</h5>
                <button class="btn btn-primary" @click="goToCheckout">
                    Vai al Checkout
                </button>
            </div>
        </div>
        <!--Dishes-->
        <div class="container dish-container">
            <p v-if="loading" class="text-center">Caricamento in corso...</p>
            <p v-if="error" class="text-danger text-center">{{ error }}</p>
            <div v-if="!loading && !error"
                class="dish-list row align-items-center d-flex justify-content-center rounded-5">
                <div class="container-fluid">
                    <div id="fda_app" class="row">
                        <!-- Start Section Header Bar -->
                        <section id="fda_header_bar" class="col-12">
                            <div class="row text-center">
                                <h2 class="text-white">Ordina ora</h2>
                            </div>
                            <div class="row fda_search_row">
                                <div class="col-12">
                                    <i class="fa fa-search"></i>
                                    <input type="text" class="fda_ip_search" placeholder="Cerca un piatto..." />
                                </div>
                            </div>
                        </section>
                        <section id="fda_product_tile" class="col-12 flex-wrap d-flex justify-content-center gap-5">
                            <div v-for="dish in filteredDishes" :key="dish.id" class="row fda_food_row mb-5">
                                <div class="col-9 w-100">
                                    <div class="food_tile active h-100">
                                        <img :src="dish.image" alt="" class="fda_product_img" />
                                        <span class="food_name">{{ dish.name }}</span>
                                        <span class="food_detail">{{ dish.description }}</span>
                                        <ul id="food_meta" class="d-flex justify-content-center">
                                            <li>
                                                <div>
                                                    <span v-if="dish.visible"
                                                        class="text-success rounded-2 fw-semibold">
                                                        <i class="bi bi-bag-check-fill mb-5">
                                                            Disponibile</i>
                                                        <span class="badge add-to-cart-button mt-2">
                                                            <span><i class="bi bi-cart-plus fs-5"></i> {{ dish.price }}
                                                                €</span>
                                                        </span>
                                                    </span>
                                                    <span v-else class="info-span text-danger rounded-2 fw-semibold">
                                                        <div>
                                                            <i class="bi bi-bag-x-fill w-100 text-center"></i> Non disponibile
                                                        </div>
                                                        <span class="badge add-to-cart-button not-available">
                                                            <i class="bi bi-cart-plus fs-5"></i>
                                                            {{ dish.price }} €
                                                        </span>
                                                    </span>
                                                </div>
                                            </li>
                                        </ul>
                                        <span>
                                            <span v-if="dish.visible">
                                                <button type="button" @click="addToCart(dish)"
                                                    class="btn btn-sm btn-default ">
                                                    Ordina ora
                                                </button>
                                            </span>
                                            <span v-else>
                                                <button type="button" class=" btn btn-sm btn-default disabled">
                                                    Ordina ora
                                                </button>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <Footer />
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

/*Cart*/

.cart {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    max-width: 500px;
    margin: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cart h4 {
    color: #333;
    font-weight: bold;
    margin-bottom: 20px;
}

.cart-item {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-item:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.cart-item button {
    font-size: 0.875rem;
}

.cart-item span {
    font-size: 1rem;
}

.cart ul {
    padding-left: 0;
    margin-bottom: 20px;
}

.cart h5 {
    font-size: 1.25rem;
    font-weight: bold;
}

.cart button {
    font-size: 1rem;
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #ff6403;
    border: none;
    color: white;
}

.cart button:hover {
    background-color: #e55b02;
}

/* main */
main {
    background-color: #333;
}

body {
    background-color: #fff;
    font-family: "Poppins", sans-serif;
}

#fda_app {
    overflow-x: hidden;
}

#fda_app>section {
    padding-top: 20px;
    padding-bottom: 0;
}

.menu {
    transform-origin: top left;
    transform: rotate(-90deg) translateX(-1150%);
    margin-left: 18.5px;
}

.menu ul {
    position: relative;
    padding: 0;
    width: 500px;
    bottom: 0;
}

.menu li {
    position: relative;
    list-style: none;
    float: left;
    margin: 0 15px;
    font-size: 10px;
    color: rgba(38, 29, 86, 0.5);
}

.menu li.active {
    font-weight: 600;
    color: rgba(38, 29, 86, 1);
}

.menu li.active:before {
    content: "";
    position: absolute;
    width: 5px;
    height: 5px;
    display: block;
    background-color: rgba(255, 0, 0, 0.6);
    border-radius: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 20px;
}

#fda_header_bar {
    font-size: 18px;
    font-weight: 600;
    color: rgba(38, 29, 86, 1);
}

#fda_header_bar span {
    font-weight: 400;
    color: rgba(38, 29, 86, 0.8);
}

.fda_search_row {
    position: relative;
    margin-top: 25px;
}

.fda_search_row .fda_ip_search {
    border: none;
    background-color: #f9f9f9;
    font-size: 12px;
    width: 100%;
    padding: 15px 15px;
    padding-left: 45px;
    border-radius: 50px;
}

.fda_search_row .fa-search {
    position: absolute;
    font-size: 14px;
    margin-top: 18px;
    margin-left: 18px;
}

.info-span {
    width: 100%;
}

.fda_food_row {
    flex-wrap: nowrap;
    min-width: 200px;
}

.fda_food_row>.col-9 {
    max-width: 245px;
}

.fda_food_row>div:not(:first-child) {
    margin-left: -15px;
}

#fda_product_tile {
    margin-top: 80px;
    margin-bottom: 20px;
    text-align: center;
}

#fda_product_tile span {
    display: block;
}

.fda_food_row div.food_tile {
    background-color: rgba(0, 0, 0, 0.05);
    font-size: 11px;
    padding: 0 25px;
    border-radius: 25px;
}

.fda_food_row div.food_tile.active {
    background-color: rgba(220, 230, 252, 1);
}

.fda_food_row div.food_tile img {
    position: relative;
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 100%;
    background-color: rgba(0, 0, 0, 0.05);
    box-shadow: inset 0 0 25px rgba(255, 255, 255, 0.15),
        inset 0 4px 0 rgba(0, 0, 0, 0.05), inset 0 -4px 0 rgba(0, 0, 0, 0.05),
        inset 0 10px 10px rgba(0, 0, 0, 0.09), 0 1px 0px rgba(0, 0, 0, 0.1),
        0 8px 7px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-top: -60px;
    margin-bottom: 18px;
}

.fda_food_row div.food_tile {
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Distribuisce gli elementi verticalmente */
    align-items: center; /* Centra gli elementi orizzontalmente */
    height: 100%; /* Assicura che tutte le schede abbiano la stessa altezza */
    padding: 20px 25px; /* Spazio interno uniforme */
    border-radius: 25px;
    text-align: center; /* Centra il testo */
    background-color: rgba(0, 0, 0, 0.05);
    font-size: 11px;
}

.food_name {
    font-size: 15px;
    font-weight: 600;
    color: rgba(38, 29, 86, 1);
    margin-bottom: 12px;
    min-height: 20px; /* Garantisce altezza uniforme */
}

.food_detail {
    font-weight: 600;
    color: rgba(38, 29, 86, 0.4);
    margin-bottom: 15px;
    min-height: 40px; /* Altezza minima per evitare sfalsamenti */
    line-height: 1.5; /* Migliora la leggibilità */
}

#food_meta {
    display: flex;
    justify-content: center; /* Centra i meta dati */
    margin-top: auto; /* Spinge verso il basso */
    margin-bottom: 15px;
    padding: 0;
}

#food_meta li {
    list-style: none;
    margin: 0 10px;
    font-size: 12px;
    font-weight: 500;
    color: rgba(38, 29, 86, 1);
}

.add-to-cart-button {
    margin-top: 10px;
    display: inline-block;
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
    user-select: none;
    color: #ff6403;
}

.btn-default {
    margin-bottom: 15px;
    padding: 12px 40px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0.5px;
    background-color: transparent;
    color: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.5);
    transition: transform 0.2s ease;
}

.active .btn-default {
    background-color: #ff6403;
    color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.04);
}

.active .btn-default:hover {
    transform: scale(1.1);
}
</style>
