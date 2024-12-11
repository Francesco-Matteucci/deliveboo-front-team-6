<script>
import axios from 'axios';

export default {
    props: {
        cart: {
            type: Array,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        showModal: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            email: "",
            firstname: "",
            lastname: "",
            address: "",
            phone_number: "",
            note: "",
            paymentInstance: null,
            primaryColor: '#ff6403'
        };
    },
    methods: {
        initializeDropIn() {
            const dropin = document.querySelector("#payment-form");
            braintree.dropin.create(
                {
                    authorization: 'sandbox_5rzg4db5_n2tdvskp75wvh2g3',
                    container: dropin,
                },
                (err, instance) => {
                    if (err) {
                        console.error("Errore nell'inizializzazione del drop-in:", err);
                    } else {
                        this.paymentInstance = instance;
                    }
                }
            );
        },
        async processPayment() {
            try {
                const payload = await this.paymentInstance.requestPaymentMethod();
                console.log("Pagamento simulato con successo, nonce:", payload.nonce);

                await axios.post('http://127.0.0.1:8000/api/orders', {
                    cart: this.cart,
                    total_price: this.total,
                    firstname: this.firstname,
                    lastname: this.lastname,
                    address: this.address,
                    phone_number: this.phone_number,
                    note: this.note,
                    restaurant_id: this.cart.length > 0 ? this.cart[0].restaurant_id : 1,
                });
                console.log("Ordine inviato con successo al back-end");

                this.$emit('order-completed');
                console.log("Evento order-completed emesso");

                this.closeModal();
                console.log("closeModal() chiamato");

            } catch (error) {
                console.error("Errore durante il pagamento:", error);
            }
        },
        closeModal() {
            this.$emit('close');
        }
    },
    mounted() {
        this.initializeDropIn();
    },
};
</script>

<template>
    <div class="modal fade" :class="{ show: showModal }" tabindex="-1" style="display: block;" role="dialog"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content custom-modal-content rounded-4 shadow">
                <div class="modal-header custom-modal-header">
                    <h1 class="modal-title fs-5 text-white  text-center">Riepilogo Ordine</h1>
                    <button type="button" class="btn-close btn-close-white" aria-label="Close"
                        @click="closeModal"></button>
                </div>
                <div class="modal-body bg-light">
                    <ul class="list-unstyled mb-0">
                        <li v-for="(item, index) in cart" :key="index" class="d-flex justify-content-between mb-2">
                            <span class="fw-semibold">{{ item.name }} x{{ item.quantity }}</span>
                            <span class="fw-bold">{{ (item.price * item.quantity).toFixed(2) }} €</span>
                        </li>
                    </ul>
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="fw-semibold">Totale </span>
                        <h3 class="fw-semibold mt-4 mb-4 text-end fs-6"><strong>{{ total }}</strong> €</h3>
                    </div>


                    <form @submit.prevent="processPayment">
                        <div class="mb-3">
                            <label for="email" class="form-label fw-semibold">Email</label>
                            <input type="email" id="email" v-model="email" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="firstname" class="form-label fw-semibold">Nome</label>
                            <input type="text" id="firstname" v-model="firstname" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="lastname" class="form-label fw-semibold">Cognome</label>
                            <input type="text" id="lastname" v-model="lastname" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="address" class="form-label fw-semibold">Indirizzo di consegna</label>
                            <input type="text" id="address" v-model="address" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="phone_number" class="form-label fw-semibold">Numero di telefono</label>
                            <input type="text" id="phone_number" v-model="phone_number" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="note" class="form-label fw-semibold">Note (opzionali)</label>
                            <textarea id="note" v-model="note" class="form-control"
                                placeholder="Appartamento, casa, hotel..."></textarea>
                        </div>

                        <div id="payment-form" class="mb-3"></div>

                        <div class="d-flex justify-content-between mt-4">
                            <button type="button" class="btn btn-outline-secondary me-3" @click="closeModal">
                                Annulla
                            </button>
                            <button type="submit" class="btn text-white" :style="{ backgroundColor: primaryColor }">
                                Paga
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div v-if="showModal" class="modal-backdrop fade show"></div>
</template>

<style scoped>
.modal-backdrop {
    background-color: rgba(0, 0, 0, .5);
}

.custom-modal-header {
    background: linear-gradient(to right, #000000, #752f02);
    border-bottom: none;
}

.custom-modal-content {
    border: none;
    overflow: hidden;
    animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-content {
    border-radius: 20px;
}
</style>