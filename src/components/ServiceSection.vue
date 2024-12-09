<script>
    export default {
        name: "ServiceSection",
        data() {
            return {
                services: [
                    {
                        title: "Diventa nostro partner",
                        description:
                            "Raggiungi più clienti con la nostra piattaforma. Gestiamo noi la consegna, così tu puoi dedicarti a offrire i migliori piatti.",
                        buttonText: "Inizia ora",
                        image: "/src/assets/service-partner.jpg",
                    },
                    {
                        title: "Consegna con noi",
                        description:
                            "La libertà di consegnare dove e quando vuoi, con ottimi guadagni, convenzioni e sconti riservati a te.",
                        buttonText: "Inizia ora",
                        image: "/src/assets/service-delivery.jpg",
                    },
                    {
                        title: "Soluzioni aziendali",
                        description:
                            "Da pranzi aziendali a budget personalizzati per i dipendenti, offriamo la soluzione giusta per ogni esigenza.",
                        buttonText: "Inizia ora",
                        image: "/src/assets/service-work.jpg",
                    },
                ],
            };
        },
    };
</script>

<template>
    <section class="service-section py-5">
        <div class="container">
            <div class="row text-center">
                <div class="col-md-4" v-for="(service, index) in services" :key="index">
                    <div class="card h-100 border-0 shadow-sm">
                        <img :src="service.image" class="card-img-top" :alt="service.title" />
                        <div class="card-body">
                            <h5 class="card-title fw-bold">{{ service.title }}</h5>
                            <p class="card-text">{{ service.description }}</p>
                            <button class="btn btn-primary">{{ service.buttonText }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
    .service-section {
        background-color: #f8f9fa;
    }

    .card {
        border-radius: 10px;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }


    .card-img-top {
        height: 300px;
        object-fit: cover;
    }

    .card-title {
        font-size: 1.25rem;
        margin-top: 15px;
    }

    .card-text {
        color: #6c757d;
        font-size: 1.2rem;
        margin: 10px 0;
    }
</style>
