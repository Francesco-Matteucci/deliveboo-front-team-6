<script>
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import Footer from "../components/Footer.vue";
import CheckoutModal from "../components/CheckoutModal.vue";
import SuccessModal from "../components/SuccessModal.vue";
import ClearCartModal from "../components/ClearCartModal.vue";

export default {
    components: {
        Footer,
        CheckoutModal,
        SuccessModal,
        ClearCartModal,
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
            showCheckout: false,
            showSuccessModal: false,
            showClearCartModal: false,
            nextRoute: null,
            pendingDish: null,
            cartRestaurantName: null,
            isMobileCartVisible: false,
        };
    },
    methods: {

        fetchDishes() {
            axios
                .get("http://127.0.0.1:8000/api/dishes")
                .then((response) => {
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
            if (this.cart.length === 0) {
                this.addDishDirectly(dish, true);
            } else {
                const firstDishInCart = this.cart[0];
                if (firstDishInCart.restaurant_id === dish.restaurant_id) {
                    this.addDishDirectly(dish, false);
                } else {
                    this.pendingDish = dish;
                    this.showClearCartModal = true;
                }
            }
        },
        addDishDirectly(dish, setName = false) {
            const existingIndex = this.cart.findIndex((item) => item.id === dish.id);
            if (existingIndex !== -1) {
                this.cart[existingIndex].quantity++;
                const [existingItem] = this.cart.splice(existingIndex, 1);
                this.cart.unshift(existingItem);
            } else {
                const newItem = { ...dish, quantity: 1 };
                this.cart.unshift(newItem);
            }

            this.updateTotal();
        },
        removeFromCart(index) {
            this.cart.splice(index, 1);
            this.updateTotal();
            // chiude il carrello quando è vuoto dopo la rimozione dell'ultimo piatto selezionato
            if (this.cart.length === 0) {
                this.isMobileCartVisible = false;
            }
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
            localStorage.setItem('cart', JSON.stringify(this.cart));
            localStorage.setItem('total', this.total.toString());
        },
        goToHome() {
            this.$router.push({ name: "Home" });
        },
        tryChangeRestaurant(newSlug) {
            this.$router.push({ name: 'RestaurantPage', params: { slug: newSlug } });
        },
        clearCartBeforeChange() {
            this.cart = [];
            this.total = 0;
            localStorage.removeItem('cart');
            localStorage.removeItem('total');

            if (this.pendingDish) {
                if (this.restaurant) {
                    this.cartRestaurantName = this.restaurant.name;
                }
                this.addDishDirectly(this.pendingDish, false);
                this.pendingDish = null;
            }

            this.showClearCartModal = false;
        },
        orderCompleted() {
            console.log("Order completed rilevato in RestaurantCard.vue!");
            this.cart = [];
            this.total = 0;
            localStorage.removeItem('cart');
            localStorage.removeItem('total');
            this.showSuccessModal = true;
            console.log("showSuccessModal impostato a true");
            this.isMobileCartVisible = false;
        },
        handleResize() {

            if (window.innerWidth >= 768 && this.isMobileCartVisible) {
                this.isMobileCartVisible = false;
            }
        }
    },
    computed: {
        cartItemCount() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    },
    mounted() {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const savedTotal = parseFloat(localStorage.getItem('total')) || 0;
        this.cart = savedCart;
        this.total = savedTotal;

        const savedName = localStorage.getItem('cartRestaurantName');
        if (savedName) {
            this.cartRestaurantName = savedName;
        }

        this.fetchRestaurant();
        this.fetchDishes();

        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    watch: {
        cartRestaurantName(newVal) {
            if (newVal) {
                localStorage.setItem('cartRestaurantName', newVal);
            } else {
                localStorage.removeItem('cartRestaurantName');
            }
        },
        isMobileCartVisible(newVal) {
            const body = document.body;
            if (newVal) {
                body.classList.add('blur-background');
            } else {
                body.classList.remove('blur-background');
            }
        }
    },

};
</script>

<template>
    <div class="content-container">
        <div class="header-top d-flex w-100 bg-black flex-column">
            <div class="d-flex">
                <div class="hero-bg-left-clickable" @click="goToHome"></div>
                <div class="row fda_search_row d-flex justify-content-center w-75">
                    <div class="search-bar-container col-6">
                        <input type="text" class="fda_ip_search" placeholder="Cerca un piatto..." />
                    </div>
                </div>
            </div>
            <button class="home-btn" @click="goToHome"><i class="bi bi-box-arrow-left"></i> Home</button>
        </div>
        <header class="d-flex">
            <div class="hero-banner m-0" :style="{ backgroundImage: `url(${restaurant?.image})` }">
            </div>
            <div class="info-box text-white p-3 text-center">
                <h1 class="fw-semibold fs-5 mb-3">{{ restaurant?.name }}</h1>
                <p class="mb-2 fs-6">
                    <i class="bi bi-geo-alt-fill text-danger me-2"></i>Indirizzo <br>
                    <span class="fw-semibold">{{ restaurant?.address }}</span>
                </p>
                <p class="fs-6 mt-2">
                    <i class="bi bi-tags-fill text-secondary me-2"></i>Categorie
                <div class="category-span d-flex flex-wrap justify-content-center">
                    <span class="fw-semibold" v-for="(category, index) in restaurant?.categories" :key="category.id">
                        {{ category.name }}
                        <span v-if="index < restaurant?.categories.length - 1">,&nbsp;</span>
                    </span>
                </div>
                </p>
            </div>
        </header>

        <main class="pt-4 container-fluid position-relative">
            <div class="dishes-row row">
                <!-- Dishes -->
                <div :class="cart.length > 0
                    ? 'col-lg-8 col-8 piatti-desktop' : 'col-lg-12 col-12 piatti-desktop'">
                    <div class="container dish-container">
                        <p v-if="loading" class="text-center">Caricamento in corso...</p>
                        <p v-if="error" class="text-danger text-center">{{ error }}</p>
                        <div v-if="!loading && !error"
                            class="dish-list row align-items-center d-flex justify-content-center">
                            <div class="container-fluid">
                                <div id="fda_app" class="row">
                                    <section id="fda_product_tile"
                                        class="col-12 flex-wrap d-flex justify-content-center gap-5">
                                        <div v-for="dish in filteredDishes" :key="dish.id"
                                            class="row fda_food_row mb-5">
                                            <div class="col-9 w-100">
                                                <div class="food_tile active h-100">
                                                    <img :src="dish.image" alt="" class="fda_product_img" />
                                                    <span class="food_name fs-5">{{ dish.name }}</span>
                                                    <span class="food_detail fs-6 overflow-y-auto overflow-x-auto">{{
                                                        dish.description
                                                    }}</span>
                                                    <ul id="food_meta" class="d-flex justify-content-center">
                                                        <li>
                                                            <div>
                                                                <span v-if="dish.visible"
                                                                    class="text-success rounded-2 fw-semibold">
                                                                    <i class="bi bi-bag-check-fill mb-5 fs-6">
                                                                        Disponibile</i>

                                                                </span>
                                                                <span v-else
                                                                    class="info-span text-danger rounded-2 fw-semibold">
                                                                    <div>
                                                                        <i
                                                                            class="bi bi-bag-x-fill w-100 text-center"></i>
                                                                        Non disponibile
                                                                    </div>

                                                                </span>
                                                                <span class="badge add-to-cart-button mt-2">
                                                                    <span class="fs-6">{{ dish.price }} €</span>
                                                                </span>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                    <span>
                                                        <span v-if="dish.visible">
                                                            <button type="button" @click="addToCart(dish)"
                                                                class="btn btn-sm btn-default fs-6">
                                                                Ordina ora
                                                            </button>
                                                        </span>
                                                        <span v-else>
                                                            <button type="button"
                                                                class=" btn btn-sm btn-default disabled">
                                                                Ordina ora
                                                            </button>
                                                        </span>
                                                    </span>
                                                    <div v-if="(itemInCart = cart.find(cartItem => cartItem.id === dish.id))"
                                                        class="mobile-dishes-counter">
                                                        <span class="me-2 fs-6">
                                                            Selezionati: {{ itemInCart.quantity }}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- PIATTI TABLET E MOBILE -->
                <div :class="cart.length > 0
                    ? 'col-lg-10 col-10 piatti-mobile' : 'col-lg-12 col-12 piatti-mobile'">
                    <div class="container dish-container">
                        <p v-if="loading" class="text-center">Caricamento in corso...</p>
                        <p v-if="error" class="text-danger text-center">{{ error }}</p>
                        <div v-if="!loading && !error"
                            class="dish-list row align-items-center d-flex justify-content-center">
                            <div class="container-fluid">
                                <div id="fda_app" class="row">
                                    <section id="fda_product_tile"
                                        class="col-12 flex-wrap d-flex justify-content-center gap-5">
                                        <div v-for="dish in filteredDishes" :key="dish.id"
                                            class="row fda_food_row mb-5">
                                            <div class="col-9 w-100">
                                                <div class="food_tile active h-100">
                                                    <img :src="dish.image" alt="" class="fda_product_img" />
                                                    <span class="food_name fs-5">{{ dish.name }}</span>
                                                    <span class="food_detail fs-6 overflow-y-auto overflow-x-auto">{{
                                                        dish.description
                                                    }}</span>
                                                    <ul id="food_meta" class="d-flex justify-content-center">
                                                        <li>
                                                            <div>
                                                                <span v-if="dish.visible"
                                                                    class="text-success rounded-2 fw-semibold">
                                                                    <i class="bi bi-bag-check-fill mb-5 fs-6">
                                                                        Disponibile</i>

                                                                </span>
                                                                <span v-else
                                                                    class="info-span text-danger rounded-2 fw-semibold">
                                                                    <div>
                                                                        <i
                                                                            class="bi bi-bag-x-fill w-100 text-center"></i>
                                                                        Non disponibile
                                                                    </div>

                                                                </span>
                                                                <span class="badge add-to-cart-button mt-2">
                                                                    <span class="fs-6">{{ dish.price }} €</span>
                                                                </span>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                    <span>
                                                        <span v-if="dish.visible">
                                                            <button type="button" @click="addToCart(dish)"
                                                                class="btn btn-sm btn-default fs-6">
                                                                Ordina ora
                                                            </button>
                                                        </span>
                                                        <span v-else>
                                                            <button type="button"
                                                                class=" btn btn-sm btn-default disabled">
                                                                Ordina ora
                                                            </button>
                                                        </span>
                                                    </span>
                                                    <div v-if="(itemInCart = cart.find(cartItem => cartItem.id === dish.id))"
                                                        class="mobile-dishes-counter">
                                                        <span class="me-2 fs-6">
                                                            Selezionati: {{ itemInCart.quantity }}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- BOTTONE PER MOSTRARE IL CARRELLO SU TABLET E SMARTPHONE -->
                <button v-if="cart.length > 0" class=" col-md-1 col-1" id="cart-button"
                    @click="isMobileCartVisible = true">
                    <i class="bi bi-cart"></i>
                    <span class="cart-badge" v-if="cartItemCount > 0">{{ cartItemCount }}</span>
                </button>
                <!-- Cart DESKTOP-->
                <div :class="cart.length > 0 ? 'col-lg-4 col-4' : 'd-none'">
                    <div class="cart sticky-top">
                        <h4 class="text-center mb-2 fs-6">
                            <i class="bi bi-cart4"></i> Carrello
                        </h4>
                        <ul class="list-unstyled">
                            <li v-for="(item, index) in cart" :key="index"
                                class="cart-item d-flex justify-content-between align-items-center py-3 px-2 mb-1">
                                <div class="d-flex align-items-center">
                                    <span class="fw-semibold" id="item-name">{{ item.name }}</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <button @click="decreaseQuantity(index)"
                                        class="btn btn-sm btn-outline-secondary me-2">
                                        <i class="bi bi-dash"></i>
                                    </button>
                                    <span class="me-2 fs-6">{{ item.quantity }}</span>
                                    <button @click="increaseQuantity(index)"
                                        class="btn btn-sm btn-outline-secondary me-2">
                                        <i class="bi bi-plus"></i>
                                    </button>
                                </div>
                                <div class="align-self-center d-flex flex-column align-items-center">
                                    <span class="fw-semibold" id="item-price">{{ (item.price * item.quantity).toFixed(2)
                                        }}
                                        €</span>
                                    <button @click="removeFromCart(index)" class=" btn btn-sm btn-danger"
                                        id="remove-btn">Rimuovi
                                    </button>
                                </div>
                            </li>
                        </ul>



                        <div v-if="cart.length > 0" class="d-flex justify-content-between align-items-center">
                            <h5 class="fw-semibold m-0 fs-6 mx-2">Totale <br> {{ total.toFixed(2) }} €</h5>
                            <button class="btn btn-outline-success" @click="showCheckout = true"
                                id="checkout-btn">Procedi
                                al
                                pagamento</button>
                        </div>

                        <CheckoutModal v-if="showCheckout" :cart="cart" :total="total" :showModal="showCheckout"
                            @close="showCheckout = false" @order-completed="orderCompleted" />
                        <!-- 
                        <SuccessModal v-if="showSuccessModal" :showModal="showSuccessModal"
                            @close="showSuccessModal = false" /> -->


                    </div>
                </div>


            </div>
        </main>
        <SuccessModal v-if="showSuccessModal" :showModal="showSuccessModal" @close="showSuccessModal = false" />
        <!-- Modale cambio ristorante -->
        <ClearCartModal v-if="showClearCartModal" :showModal="showClearCartModal" :nextRoute="nextRoute"
            @close="showClearCartModal = false" @clear-cart="clearCartBeforeChange" />
        <Footer />
    </div>

    <!-- MODALE MOBILE/TABLET FUORI DAL CONTENT-CONTAINER -->
    <div v-if="isMobileCartVisible" class="modal">
        <div class="modal-content p-4 bg-white position-relative">
            <button class="btn-close position-absolute top-0 end-0 m-3" @click="isMobileCartVisible = false"></button>
            <h4 class="text-center mb-2 fs-6">
                <i class="bi bi-cart4"></i> Carrello
            </h4>
            <ul class="list-unstyled">
                <li v-for="(item, index) in cart" :key="index"
                    class="cart-item d-flex justify-content-between align-items-center py-3 px-2 mb-1">
                    <div class="d-flex align-items-center">
                        <span class="fw-semibold" id="item-name">{{ item.name }}</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <button @click="decreaseQuantity(index)" class="btn btn-sm btn-outline-secondary me-2"
                            id="decrease-btn">
                            <i class="bi bi-dash"></i>
                        </button>
                        <span class="me-2 fs-6">{{ item.quantity }}</span>
                        <button @click="increaseQuantity(index)" class="btn btn-sm btn-outline-secondary me-2"
                            id="increase-btn">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                    <div class="align-self-center d-flex flex-column align-items-center">
                        <span class="fw-semibold" id="item-price">{{ (item.price * item.quantity).toFixed(2) }}
                            €</span>
                        <button @click="removeFromCart(index)" class="btn btn-sm btn-danger"
                            id="remove-btn">Rimuovi</button>
                    </div>
                </li>
            </ul>

            <div v-if="cart.length > 0" class="d-flex justify-content-between align-items-center">
                <h5 class="fw-semibold m-0 fs-6 mx-2">Totale <br> {{ total.toFixed(2) }} €</h5>
                <button class="btn btn-outline-success text-white" @click="showCheckout = true" id="checkout-btn">
                    Procedi al pagamento
                </button>
            </div>
            <CheckoutModal v-if="showCheckout" :cart="cart" :total="total" :showModal="showCheckout"
                @close="showCheckout = false" @order-completed="orderCompleted" />

            <ClearCartModal v-if="showClearCartModal" :showModal="showClearCartModal" :nextRoute="nextRoute"
                @close="showClearCartModal = false" @clear-cart="clearCartBeforeChange" />
        </div>
    </div>

</template>


<style scoped>
.home-btn {
    min-width: 80px;
    max-width: 80px;
    background-color: black;
    color: white;
    border: none;
    font-size: 1rem;
    margin-left: 2.5vw;
    margin-bottom: 10px;

    &:active {
        scale: 1.1;
    }
}

.search-bar-container {
    max-width: 100%;
    margin-top: 2.7rem;
}

.search-bar-container input {
    padding: 10px;
    font-size: 1rem;
    border: none;
    border-radius: 20px;
    transition: 0.3s ease;
    min-width: 40vw;
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
    background: no-repeat;
    height: 40vh;
    width: 70vw;
    display: flex;
    background-size: 100% 100%;
    background-position: center;
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
    width: 30vw;
    background-color: #2f2e2e;
}

/* STILI PER LA MODALE MOBILE/TABLET CON BLUR */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(5px);
    background: rgba(0, 0, 0, 0.1);
    z-index: 1;
}

.modal-content {
    position: relative;
    z-index: 3;
    background: white;
    border-radius: 10px;
    max-height: 90vh;
    max-width: 95vw;
    overflow-y: auto;
    padding: 20px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.modal-content form {
    width: 100%;
}

input,
textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 0.9rem;
    border: 1px solid #ddd;
    border-radius: 5px;
}

input:focus,
textarea:focus {
    outline: none;
    border-color: #ff6403;
    box-shadow: 0 0 5px rgba(255, 100, 3, 0.5);
}

#payment-form {
    min-height: 200px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: #f9f9f9;
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
.mobile-dishes-counter span {
    color: rgb(116, 113, 113);
}

.cart {
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    max-width: 500px;
    min-width: 300px;
    margin: auto;
}

.sticky-top {
    top: 50px;
}

.cart h4 {
    color: #333;
    font-weight: bold;
    margin-bottom: 20px;
}

.cart-item {
    background-color: #ffffff;
    border-radius: 8px;
    min-width: 200px;
}

.cart-item:hover {
    box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.2);
}

.cart-item button {
    font-size: 0.875rem;
}

.cart-item span {
    font-size: 1rem;
}

.cart ul {
    max-height: 300px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #ee5f07 #f8f9fa;
}

.cart ul::-webkit-scrollbar {
    width: 8px;
}

.cart ul::-webkit-scrollbar-thumb {
    background: #6c757d;
    border-radius: 6px;
}

.cart ul::-webkit-scrollbar-thumb:hover {
    background: #495057;
}

.cart ul::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 6px;
}

.cart h5 {
    font-size: 1.25rem;
    font-weight: bold;
}

#remove-btn {
    background-color: #ff0019d8;

    &:hover {
        background-color: #d60505;
    }
}

#checkout-btn {
    margin-right: 7px;
    background-color: #248a0a;

    &:hover {
        background-color: #107a22;
    }
}

.cart button {
    font-size: 1rem;
    padding: 2px 6px;
    border-radius: 5px;
    background-color: #ff6403;
    border: none;
    color: white;
}

.cart button:hover {
    background-color: #e55b02;
}


#item-name {
    font-size: 0.9rem;
    min-width: 80px;
    max-width: 80px;
    word-wrap: break-word;
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
    align-items: center;
    height: 100%;
    padding: 20px 25px;
    border-radius: 25px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.05);
    font-size: 11px;
}

.food_name {
    font-weight: 600;
    color: rgba(38, 29, 86, 1);
    margin-bottom: 12px;
    min-height: 20px;
}

.food_detail {
    font-weight: 600;
    color: rgba(38, 29, 86, 0.4);
    margin-bottom: 15px;
    min-height: 40px;
    max-height: 150px;
    max-width: 171px;
    line-height: 1.5;
}

#food_meta {
    display: flex;
    justify-content: center;
    margin-top: auto;
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

.mobile-dishes-counter {
    display: none;
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

#cart-button {
    position: sticky;
    top: 20px;
    z-index: 1;
    width: 50px;
    height: 50px;
    background-color: #e55b02;
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

#cart-button:active {
    scale: 1.1;
}

#cart-button .cart-badge {
    position: absolute;
    bottom: -4px;
    right: -4px;
    background: red;
    color: white;
    font-size: 0.75rem;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}


/* DESKTOP S-M-L */
@media (min-width: 768px) {

    #cart-button {
        display: none;
    }

    .piatti-mobile {
        display: none;
    }
}


/* TABLET */
@media (max-width: 768px) {
    .hero-bg-left-clickable {
        width: 23vw;
        height: 15vh;
    }

    .search-div {
        justify-content: unset
    }

    .search-bar-container {
        margin-top: 0;
        display: flex;
        align-items: center;
        min-width: 60vw;
        max-width: 90vw;
    }

    .search-bar-container input {
        margin-top: 0;
        display: flex;
        align-items: center;
        min-width: 50vw;
        max-width: 90vw;
    }

    header {
        flex-direction: column;
    }

    .hero-banner {
        width: 100vw;
    }

    .info-box {
        width: 100vw;
    }

    .cart {
        display: none;
    }

    .piatti-desktop {
        display: none;
    }

    .modal-content {
        padding: 15px;
        max-height: 85vh;
        overflow-y: auto;
    }

    input,
    textarea,
    button {
        font-size: 0.85rem;
        /* Adatta i font per schermi più piccoli */
    }

    #payment-form {
        min-height: 200px;
        margin-top: 10px;
    }

    #increase-btn,
    #decrease-btn {
        background-color: #ee5f07;
        color: white;
        border: none;
    }

    .dishes-row {
        gap: 4vw;
    }

    #cart-button {
        width: 45px;
        height: 45px;
    }

}

/* MOBILE */
@media (max-width: 375px) {
    .hero-bg-left-clickable {
        width: 30vw;
        height: 15vh;
    }

    .search-div {
        justify-content: unset
    }

    .search-bar-container {
        margin-top: 0;
        display: flex;
        align-items: center;
        min-width: 60vw;
        padding-left: 0px;

    }

    .search-bar-container input {
        margin-top: 0;
        display: flex;
        align-items: center;
        min-width: 60vw;
        max-width: 90vw;
    }

    .home-btn {
        font-size: 0.9rem;
        margin-left: 5px;
    }

    .mobile-dishes-counter {
        display: block;
    }

    .cart {
        display: none;
    }

    .piatti-desktop {
        display: none;
    }

    #cart-button {
        width: 35px;
        height: 35px;
        margin-left: 0px;
        margin-bottom: 0px;
    }

    .dishes-row {
        gap: 0.5rem;
    }

}
</style>