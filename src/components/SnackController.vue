<template>
    <div>
        <v-snackbar
                v-for="(snackbar, i) in snackbars" :key="i" name="slide-fade"
                :value="hasSnackBars"
                bottom
                left
                color="blue"
                :style="{'margin-bottom': i * 60 + 'px'}"
                outlined
        >
            {{ snackbar.text}}
            <template v-slot:action="{ attrs }">
                <v-btn
                        color="red"
                        text
                        v-bind="attrs"
                        v-on:click="eventBus.$emit('stack-panel-open', snackbar.link)"
                >
                    {{ snackbar.linkName }}
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
    import eventBus from "../eventBus";

    export default {
        name: "SnackController",
        data: () => {
            return {
                snackbars: [],
                eventBus
            }
        },
        methods: {
            showSnackBar: function (text, linkName, link) {
                this.snackbars.splice(0, 0, {
                    text, link, linkName
                });
                setTimeout(this.popSnack, 6000);
            },
            popSnack(){
                if (this.snackbars && this.snackbars.length > 0) {
                    this.snackbars.pop();
                }
            }
        },
        mounted() {
            eventBus.$on('snack-show', (text, linkName, link) => {
                this.showSnackBar(text, linkName, link);
            })
        },
        computed: {
            hasSnackBars: function () {
                return this.snackbars && this.snackbars.length > 0;
            }
        }
    }
</script>

<style scoped>

</style>
