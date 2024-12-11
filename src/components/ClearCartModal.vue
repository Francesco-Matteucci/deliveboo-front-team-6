<script>
    export default {
        props: {
            showModal: {
                type: Boolean,
                required: true
            },
            nextRoute: {
                type: Object,
                required: true
            }
        },
        methods: {
            cancel() {
                this.$emit('close');
            },
            confirmChange() {
                this.$emit('clear-cart');
                this.$router.push(this.nextRoute);
                this.$emit('close');
            }
        }
    };
</script>

<template>
    <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content rounded-4 shadow">
                <div class="modal-header">
                    <h5 class="modal-title">Carrello non vuoto</h5>
                    <button type="button" class="btn-close" @click="cancel"></button>
                </div>
                <div class="modal-body">
                    <p>Stai per cambiare ristorante. Il tuo carrello verrà eliminato. Vuoi procedere?</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="cancel">Annulla</button>
                    <button class="btn btn-danger" @click="confirmChange">Conferma</button>
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
</style>