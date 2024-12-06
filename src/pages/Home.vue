<script>
    import axios from "axios";
    import Hero from "../components/Hero.vue";
    import ServiceSection from "../components/ServiceSection.vue";
    import TrackingSection from "../components/TrackingSection.vue";

    export default {
        name: "Home",
        data() {
            return {
                restaurants: [],
                filteredRestaurants: [],
                loading: true,
                error: null,
                categories: [],
                selectedCategories: [],
                errorCategories: null,
            };
        },
        components: {
            Hero,
            ServiceSection,
            TrackingSection,
        },
        methods: {
            fetchRestaurants() {
                axios
                    .get("http://127.0.0.1:8000/api/restaurants")
                    .then((response) => {
                        console.log("Risposta API Ristoranti:", response.data);
                        this.restaurants = response.data.results;
                        this.filteredRestaurants = this.restaurants;
                    })
                    .catch((error) => {
                        console.error("Errore API Ristoranti:", error);
                        this.error = "Errore nel caricamento dei dati.";
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            fetchCategories() {
                axios
                    .get("http://127.0.0.1:8000/api/category")
                    .then((response) => {
                        console.log("Risposta API Categorie:", response.data);
                        this.categories = response.data.results;
                    })
                    .catch((error) => {
                        console.error("Errore API Categorie:", error);
                        this.errorCategories = "Errore nel caricamento delle categorie.";
                    });
            },
            filterRestaurants() {
                if (this.selectedCategories.length > 0) {
                    this.filteredRestaurants = this.restaurants.filter((restaurant) =>
                        restaurant.categories.some((category) =>
                            this.selectedCategories.includes(category.id)
                        )
                    );
                } else {
                    this.filteredRestaurants = this.restaurants;
                }
            },
            toggleCategorySelection(categoryId) {
                const index = this.selectedCategories.indexOf(categoryId);
                if (index > -1) {
                    this.selectedCategories.splice(index, 1);
                } else {
                    this.selectedCategories.push(categoryId);
                }
                this.filterRestaurants();
            },
        },
        mounted() {
            this.fetchRestaurants();
            this.fetchCategories();
        },
    };
</script>


<template>
    <div>
        <Hero />
        <div class="container mt-4">
            
            <div v-if="categories.length" class="categories-container text-center mb-4">
                <h1 class="text-center">Lista dei Ristoranti</h1>
                <h2 class="mb-3">Filtra per Categoria</h2>
                <div class="categories-list d-flex flex-wrap justify-content-center">
                    <button v-for="category in categories" :key="category.id"
                        @click="toggleCategorySelection(category.id)" class="btn btn-outline-primary mx-2 mb-2"
                        :class="{ active: selectedCategories.includes(category.id) }">
                        {{ category.name }}
                    </button>
                    <button @click="selectedCategories = []; filterRestaurants()"
                        class="btn btn-outline-secondary mx-2 mb-2"
                        :class="{ active: selectedCategories.length === 0 }">
                        Tutte le Categorie
                    </button>
                </div>
            </div>

            <p v-if="loading" class="text-center">
                <span class="spinner-border text-primary" role="status" aria-hidden="true"></span>
                Caricamento in corso...
            </p>
            <p v-if="error" class="text-danger text-center">{{ error }}</p>
            <p v-if="errorCategories" class="text-danger text-center">{{ errorCategories }}</p>

            <div v-if="!loading && !error" class="row">
                <div v-for="restaurant in filteredRestaurants" :key="restaurant.id" class="col-md-4 mb-4">
                    <div class="restaurant-card">
                        <div class="restaurant-card-image" :style="{ backgroundImage: `url(${restaurant.image})` }">
                            <div class="restaurant-card-overlay">
                                <h5 class="restaurant-name">{{ restaurant.name }}</h5>
                            </div>
                        </div>
                        <div class="restaurant-card-body">
                            <p><strong>Indirizzo:</strong> {{ restaurant.address }}</p>
                            <p><strong>Partita IVA:</strong> {{ restaurant.vat_number }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <TrackingSection />
    <ServiceSection />
</template>


<style scoped>
    .categories-container {
        background-color: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .categories-list button {
        padding: 10px 20px;
        font-size: 1rem;
        border-radius: 30px;
        transition: all 0.3s ease;
    }

    .categories-list button.active {
        background-color: #007bff;
        color: #fff;
        border-color: #007bff;
    }


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