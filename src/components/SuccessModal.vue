<script>
    export default {
        props: {
            showModal: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                primaryColor: '#ff6403'
            };
        },
        methods: {
            closeModal() {
                this.$emit('close');
            }
        }
    };
</script>

<template>
    <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content custom-modal-content rounded-4 shadow text-center p-4">
                <div class="modal-header custom-modal-header justify-content-center">
                    <h5 class="modal-title fs-5 text-white">Ordine Completato!</h5>
                </div>
                <div class="modal-body bg-light">
                    <p class="fw-semibold mb-4">Il tuo pagamento è andato a buon fine. Grazie per aver ordinato con noi!
                    </p>
                    <button class="btn text-white w-100" :style="{ backgroundColor: primaryColor }" @click="closeModal">
                        Ok
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-backdrop fade show"></div>
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