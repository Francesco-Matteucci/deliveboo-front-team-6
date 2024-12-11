<script>
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
                clientToken: "sandbox_g42y39zw_348pk9cgf3bgv2wb",
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
                } catch (error) {
                    console.error("Errore durante il pagamento:", error);
                }
            },
        },
        mounted() {
            // if (!this.cart.length || !this.total) {
            //     alert("Nessun carrello trovato. Ritorno alla pagina precedente.");
            //     this.$router.push({ name: "Home" });
            // }
            this.initializeDropIn();
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
