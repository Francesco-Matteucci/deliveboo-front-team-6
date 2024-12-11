<script>
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import Footer from "../components/Footer.vue";

export default {
    components: {
        Footer,
    },
    props: {
        slug: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            restaurant: null,
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
            axios
                .get("http://127.0.0.1:8000/api/dishes")
                .then((response) => {
                    console.log("Risposta API piatti:", response.data);
                    this.dishes = response.data.results;
                    this.filteredDishes = this.dishes.filter(
                        (dish) => dish.restaurant_id === this.restaurant.id
                    );
                })
                .catch((error) => {
                    console.error("Errore API piatti:", error);
                    this.error = "Errore nel caricamento dei dati.";
                });
        },
        fetchRestaurant() {
            const slug = this.$route.params.slug;
            axios
                .get(`http://127.0.0.1:8000/api/restaurants/${slug}`)
                .then((response) => {
                    console.log("Dettagli ristorante:", response.data);
                    this.restaurant = response.data.results;
                })
                .catch((error) => {
                    console.error("Errore API ristorante:", error);
                    this.error = "Errore nel caricamento del ristorante.";
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        addToCart(dish) {
            const existingDish = this.cart.find((item) => item.id === dish.id);
            if (existingDish) {
                existingDish.quantity++;
            } else {
                this.cart.push({ ...dish, quantity: 1 });
            }
            this.updateTotal();
        },
        removeFromCart(index) {
            this.cart.splice(index, 1);
            this.updateTotal();
        },
        increaseQuantity(index) {
            this.cart[index].quantity++;
            this.updateTotal();
        },
        decreaseQuantity(index) {
            if (this.cart[index].quantity > 1) {
                this.cart[index].quantity--;
            } else {
                this.removeFromCart(index);
            }
            this.updateTotal();
        },
        updateTotal() {
            this.total = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            this.total = parseFloat(this.total.toFixed(2));
        },
        goToHome() {
            this.$router.push({ name: "Home" });
        },
    },
    mounted() {
        this.fetchRestaurant();
        this.fetchDishes();
    },
};
</script>

<template>
    <div class="header-top d-flex w-100 bg-black">
        <div class="hero-bg-left-clickable" @click="goToHome"></div>
        <div class="row fda_search_row d-flex justify-content-center w-75">
            <div class="search-bar-container col-6 mt-5">
                <input type="text" class="fda_ip_search" placeholder="Cerca un piatto..." />
            </div>
        </div>
    </div>
    <button class="" @click="goToHome"><-- Torna alla home</button>
            <header class="hero-banner position-relative w-100 m-0"
                :style="{ backgroundImage: `url(${restaurant?.image})` }">
                <!-- Hero Content -->
                <div class="hero-overlay position-absolute top-0 start-0 d-flex p-4">
                    <div class="info-box bg-dark bg-opacity-75 text-white p-4 rounded">
                        <h1 class="fw-bold">{{ restaurant?.name }}</h1>
                        <p class="mb-2">
                            <i class="bi bi-geo-alt-fill text-danger me-2"></i>
                            {{ restaurant?.address }}
                        </p>
                        <p>
                            <i class="bi bi-tags-fill text-secondary me-2"></i>
                            Categorie:
                            <span v-for="(category, index) in restaurant?.categories" :key="category.id">
                                <strong>{{ category.name }}</strong>
                                <span v-if="index < restaurant?.categories.length - 1">,</span>
                            </span>
                        </p>
                    </div>
                </div>
            </header>

            <main class="pt-4">
                <!--Cart-->
                <div class="cart">
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
                                <button @click="decreaseQuantity(index)" class="btn btn-sm btn-outline-secondary me-2">
                                    <i class="bi bi-dash"></i>
                                </button>
                                <span class="me-3">{{ item.quantity }}</span>
                                <button @click="increaseQuantity(index)" class="btn btn-sm btn-outline-secondary me-2">
                                    <i class="bi bi-plus"></i>
                                </button>
                                <span class="me-3">{{ (item.price * item.quantity).toFixed(2) }} €</span>
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
                                </section>
                                <section id="fda_product_tile"
                                    class="col-12 flex-wrap d-flex justify-content-center gap-5">
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
                                                                    <span><i class="bi bi-cart-plus fs-5"></i> {{
                                                                        dish.price }}
                                                                        €</span>
                                                                </span>
                                                            </span>
                                                            <span v-else
                                                                class="info-span text-danger rounded-2 fw-semibold">
                                                                <div>
                                                                    <i class="bi bi-bag-x-fill w-100 text-center"></i>
                                                                    Non
                                                                    disponibile
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
.search-bar-container {
    max-width: 100%;
}

.search-bar-container input {
    padding: 10px;
    font-size: 1rem;
    border: none;
    border-radius: 20px;
    transition: 0.3s ease;
    min-width: 35vw;
    max-width: 60vw;
    background-color: #252525;
    color: white;
}

.search-bar-container input:focus {
    border-color: #ff6204;
    outline: none;
    box-shadow: 0 0 5px #ff6204;
}

.search-bar-container input::placeholder {
    color: rgb(122, 112, 112);
}

.hero-banner {
    height: 40vh;
    width: 30vw;
    display: flex;
    justify-self: flex-start;
    background-size: cover;
    background-position: center;
    position: relative;
    color: #fff;
}

.hero-overlay {
    height: 40vh;
    width: 20vw;
    background: rgba(0, 0, 0, 0.5);
}

.info-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 20vw;
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
    background: radial-gradient(circle at top left, rgba(0, 0, 0, 0.616), transparent 50%),
        radial-gradient(circle at top right, black, transparent 50%),
        radial-gradient(circle at bottom left, black, transparent 50%),
        radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.616), transparent 50%),
        #752f02;
    background-size: 100% 100%;
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
    background-color: #F9F9F9;
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
    justify-content: space-between;
    /* Distribuisce gli elementi verticalmente */
    align-items: center;
    /* Centra gli elementi orizzontalmente */
    height: 100%;
    /* Assicura che tutte le schede abbiano la stessa altezza */
    padding: 20px 25px;
    /* Spazio interno uniforme */
    border-radius: 25px;
    text-align: center;
    /* Centra il testo */
    background-color: rgba(0, 0, 0, 0.05);
    font-size: 11px;
}

.food_name {
    font-size: 15px;
    font-weight: 600;
    color: rgba(38, 29, 86, 1);
    margin-bottom: 12px;
    min-height: 20px;
    /* Garantisce altezza uniforme */
}

.food_detail {
    font-weight: 600;
    color: rgba(38, 29, 86, 0.4);
    margin-bottom: 15px;
    min-height: 40px;
    /* Altezza minima per evitare sfalsamenti */
    line-height: 1.5;
    /* Migliora la leggibilità */
}

#food_meta {
    display: flex;
    justify-content: center;
    /* Centra i meta dati */
    margin-top: auto;
    /* Spinge verso il basso */
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
    color: #000000;
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
    background: #ee5f07;
    background-size: 100%;
    color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.04);

    &:hover {
        scale: 1.1;
    }

    &:active {
        color: white;
        background-color: #ee5f07;
        scale: 1;
        border: 1px solid rgba(0, 0, 0, 0.04);
    }
}

.hero-bg-left-clickable {
    background-image: url("/src/assets/logo-deliveboo.webp");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    margin-top: 1vw;
    width: 15vw;
    height: 20vh;
    cursor: pointer;
}

@media (max-width: 375px) {
    .hero-bg-left-clickable {
        width: 30vw;
        height: 15vh;
    }
}
</style>
