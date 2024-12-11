<script>
    import RestaurantCard from "../components/RestaurantCard.vue";

    export default {
        name: "RestaurantPage",
        components: {
            RestaurantCard,
        },
        data() {
            return {
                restaurantSlug: this.$route.params.slug,
            };
        },
    };
</script>

<template>
    <div>
        <RestaurantCard :slug="restaurantSlug" />
        <RestaurantCard :slug="restaurantId" />
    </div>
</template>

<style scoped></style>