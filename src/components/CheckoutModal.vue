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
                paymentInstance: null,
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
                    console.log("Pagamento in corso...");
                    console.log("Nonce generato:", payload.nonce);

                    alert("Pagamento simulato con successo!");

                    await axios.post('http://127.0.0.1:8000/api/orders', {
                        cart: this.cart,
                        total: this.total,
                        email: this.email
                    });

                    this.$emit('order-completed');

                    this.closeModal();
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
            <div class="modal-content rounded-4 shadow">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Riepilogo Ordine</h1>
                    <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <ul class="list-unstyled">
                        <li v-for="(item, index) in cart" :key="index" class="d-flex justify-content-between mb-2">
                            <span>{{ item.name }} x{{ item.quantity }}</span>
                            <span>{{ (item.price * item.quantity).toFixed(2) }} €</span>
                        </li>
                    </ul>
                    <h3 class="fw-semibold mt-4 mb-4">Totale: {{ total }} €</h3>

                    <form @submit.prevent="processPayment">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email:</label>
                            <input type="email" id="email" v-model="email" class="form-control" required>
                        </div>
                        <div id="payment-form"></div>
                        <button type="submit" class="btn btn-primary mt-3 w-100">Paga</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div v-if="showModal" class="modal-backdrop fade show"></div>
</template>

<style scoped>

    .modal[role="dialog"] {
        display: block;
    }

    :global(body) {
        transition: filter 0.3s ease;
    }

    :global(body.modal-open) {
        filter: blur(2px);
    }

    .modal-content {
        border-radius: 15px;
    }

    .btn-close {
        background: none;
        border: none;
    }

    .modal-backdrop {
        background-color: rgba(0, 0, 0, .5);
    }
</style>
