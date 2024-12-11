<script>
    import RestaurantCard from "../components/RestaurantCard.vue";

    export default {
        name: "RestaurantPage",
        components: {
            RestaurantCard,
        },
        data() {
            return {
                restaurantId: this.$route.params.id,
            };
        },
    };
</script>

<template>
    <div>
        <RestaurantCard :slug="restaurantId" />
    </div>
</template>

<style scoped></style>