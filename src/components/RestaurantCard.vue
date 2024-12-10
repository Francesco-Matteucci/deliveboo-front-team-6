<script>
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
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
  },
  mounted() {
    this.fetchDishes();
    this.fetchRestaurants();
  },
};
</script>

<template>
  <header class="d-flex w-100">
    <!-- Restaurant card -->
    <div class="d-flex align-items-center justify-content-center w-100">
      <div
        v-for="restaurant in filteredRestaurants"
        :key="restaurant.id"
        class="restaurant-card d-flex flex-column justify-content-between rounded-5 w-100"
        style="
          min-height: 300px;
          height: 100%;
          background-color: #f8f9fa;
          overflow: hidden;
        "
      >
        <div
          class="restaurant-banner w-100"
          :style="{
            backgroundImage: `url(${restaurant.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '70%',
          }"
        >
          <div
            class="restaurant-overlay d-flex justify-content-center align-items-center h-100"
          >
            <h1 class="text-white text-center fw-bold">
              {{ restaurant.name }}
            </h1>
          </div>
        </div>

        <div class="restaurant-details p-4 bg-light" style="flex: 1">
          <p class="mb-2">
            <i class="bi bi-geo-alt-fill text-danger me-2"></i>
            <strong>{{ restaurant.address }}</strong>
          </p>
          <p class="text-muted">
            <i class="bi bi-tags-fill text-secondary me-2"></i>
            Categorie:
            <span
              v-for="(category, index) in restaurant.categories"
              :key="category.id"
            >
              <strong>{{ category.name }}</strong>
              <span v-if="index < restaurant.categories.length - 1">, </span>
            </span>
          </p>
        </div>
      </div>
    </div>
  </header>

  <main>
    <div class="container-fluid">
      <div id="fda_app" class="row">
        <!-- Start Section Header Bar -->
        <section id="fda_header_bar" class="col-12">
          <div class="row">
            <div class="col-12"><span>Ordina</span></div>
          </div>
          <div class="row fda_search_row">
            <div class="col-12">
              <i class="fa fa-search"></i>
              <input
                type="text"
                class="fda_ip_search"
                placeholder="Cerca un piatto..."
              />
            </div>
          </div>
        </section>
        <!-- End Section Header Bar -->

        <!-- Start Section Body Part 1 -->

        <section id="fda_product_tile" class="col-12">
          <div
            v-for="dish in filteredDishes"
            :key="dish.id"
            class="row fda_food_row"
          >
            <div class="col-9">
              <div class="food_tile active">
                <img :src="dish.image" alt="" class="fda_product_img" />
                <span class="food_name">{{ dish.name }}</span>
                <span class="food_detail">{{ dish.description }}</span>
                <ul id="food_meta" class="d-flex justify-content-center">
                  <li>
                    <div>
                      <span
                        v-if="dish.visible"
                        class="text-success rounded-2 fw-semibold"
                      >
                        <i class="bi bi-bag-check-fill mb-5"> Disponibile</i>
                        <button
                          type="button"
                          class="badge add-to-cart-button mt-2"
                        >
                          <span
                            ><i class="bi bi-cart-plus fs-5"></i
                            >{{ dish.price }} €</span
                          >
                        </button>
                      </span>
                      <span v-else class="text-danger rounded-2 fw-semibold">
                        <i class="bi bi-bag-x-fill me-3"> Non disponibile</i>
                        <button
                          type="button"
                          class="badge add-to-cart-button not-available"
                        >
                          {{ dish.price }} €
                        </button>
                      </span>
                    </div>
                  </li>
                </ul>
                <button type="button" class="btn btn-sm btn-default">
                  Ordina ora
                </button>
              </div>
            </div>
          </div>
        </section>
        <!-- End Section Body Part 1 -->
      </div>
    </div>
  </main>
</template>

<style scoped>
header {
  height: 100vh;
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

/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@òòò */
body {
  background-color: #fff;
  font-family: "Poppins", sans-serif;
}

#fda_app {
  padding-left: 50px;
  padding-top: 10px;
  overflow-x: hidden;
}

#fda_app > section {
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

/** Start Section Header Bar **/

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

/** End Section Header Bar **/

/** Start Section Body Part 1 **/

.fda_food_row {
  flex-wrap: nowrap;
}

.fda_food_row > .col-9 {
  max-width: 245px;
}

.fda_food_row > div:not(:first-child) {
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
  border-radius: 100%;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.05);
  box-shadow: inset 0 0 25px rgba(255, 255, 255, 0.15),
    inset 0 4px 0 rgba(0, 0, 0, 0.05), inset 0 -4px 0 rgba(0, 0, 0, 0.05),
    inset 0 10px 10px rgba(0, 0, 0, 0.09), 0 1px 0px rgba(0, 0, 0, 0.1),
    0 8px 7px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: -60px;
  margin-bottom: 18px;
}

div.food_tile.active img {
  background-color: rgba(220, 230, 252, 0.85);
}

.food_name {
  font-size: 15px;
  font-weight: 600;
  color: rgba(38, 29, 86, 1);
  margin-bottom: 12px;
}

.food_detail {
  font-size: 10px;
  color: rgba(38, 29, 86, 0.4);
  margin-bottom: 15px;
}

#food_meta {
  margin: 0;
  padding: 0;
}

#food_meta li {
  list-style: none;
  float: left;
  width: 50%;
  margin-bottom: 25px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(38, 29, 86, 1);
}

#food_meta li span {
  font-size: 12px;
  font-weight: 500;
  color: rgba(38, 29, 86, 0.5);
}

.btn-default {
  border: 1px solid rgba(0, 0, 0, 0.5);
  margin-bottom: 15px;
  padding: 12px 40px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.5px;
  background-color: transparent;
  color: rgba(0, 0, 0, 0.8);
}

.active .btn-default {
  border: 1px solid rgba(0, 0, 0, 0.04);
  background-color: #ff6403;
  color: #fff;
  &:hover {
    scale: 1.1;
  }
  &:active {
    scale: 1;
  }
}
/** End Section Body Part 1 **/
</style>
