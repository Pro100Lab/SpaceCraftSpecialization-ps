<template>
    <v-card class="fill-height elevation-4">
        <v-col class="px-4">
            <v-subheader class="text-center">Цена</v-subheader>
            <v-range-slider
                    v-model="range"
                    :max="max"
                    :min="min"
                    hide-details
                    step="500"
                    class="align-center"
            >
                <template v-slot:prepend>
                    <v-text-field
                            :value="range[0]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                            @change="$set(range, 0, $event)"
                    ></v-text-field>
                </template>
                <template v-slot:append>
                    <v-text-field
                            :value="range[1]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                            @change="$set(range, 1, $event)"
                    ></v-text-field>
                </template>
            </v-range-slider>
        </v-col>
    </v-card>
</template>

<script>
    export default {
        name: "ProductFilter",
        data () {
            return {
                min: 10000,
                max: 90000,
                range: [15000, 60000],
            }
        },
    }
</script>

<style scoped>

</style>
