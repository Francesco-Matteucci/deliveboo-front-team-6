import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import RestaurantPage from '../pages/RestaurantPage.vue';
import Checkout from '../components/Checkout.vue';
const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/restaurants/:slug', name: 'RestaurantPage', component: RestaurantPage },
    { path: '/checkout', name: 'Checkout', component: Checkout, props: true},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;