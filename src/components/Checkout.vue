<script>
    import axios from "axios";

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
        },
        data() {
            return {
                email: "",
                clientToken: null, // Token per il Drop-in UI
            };
        },
        methods: {
            async fetchClientToken() {
                try {
                    const response = await axios.get("http://127.0.0.1:8000/api/braintree/token");
                    this.clientToken = response.data.clientToken;
                    this.initializeDropIn();
                } catch (error) {
                    console.error("Errore nel recupero del client token:", error);
                }
            },
            initializeDropIn() {
                if (this.clientToken) {
                    const dropin = document.querySelector("#payment-form");
                    braintree.dropin.create(
                        {
                            authorization: this.clientToken,
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
                }
            },
            async processPayment() {
                try {
                    const payload = await this.paymentInstance.requestPaymentMethod();
                    console.log("Pagamento in corso...", payload);

                    // Effettua il pagamento tramite l'API back-end
                    const response = await axios.post("http://127.0.0.1:8000/api/braintree/checkout", {
                        paymentMethodNonce: payload.nonce,
                        amount: this.total,
                        email: this.email,
                    });

                    if (response.data.success) {
                        alert("Pagamento effettuato con successo!");
                    } else {
                        alert("Pagamento fallito. Riprova.");
                    }
                } catch (error) {
                    console.error("Errore durante il pagamento:", error);
                }
            },
        },
        mounted() {
            this.fetchClientToken();
        },
    };
</script>

<template>
    <div class="checkout-container">
        <h1>Riepilogo Ordine</h1>

        <!-- Riepilogo ordine -->
        <div class="order-summary">
            <ul>
                <li v-for="(item, index) in cart" :key="index" class="order-item">
                    <span>{{ item.name }} x{{ item.quantity }}</span>
                    <span>{{ (item.price * item.quantity).toFixed(2) }} €</span>
                </li>
            </ul>
            <h3>Totale: {{ total }} €</h3>
        </div>

        <!-- Form di pagamento -->
        <form @submit.prevent="processPayment">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required />
            </div>
            <div id="payment-form">
                <!-- Braintree Drop-in UI verrà inserito qui -->
            </div>
            <button type="submit" class="btn btn-primary">Paga</button>
        </form>
    </div>
</template>

<style scoped>
    .checkout-container {
        max-width: 600px;
        margin: 0 auto;
    }

    .order-summary {
        margin-bottom: 20px;
    }

    .order-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .form-group {
        margin-bottom: 20px;
    }
</style>
