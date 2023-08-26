<template>
    <v-sheet class="d-flex flex-row justify-center align-center transparent">
        <v-btn
                class="rounded-xl"
                :elevation="step === 1 ? 0 : 10"
                :style="{'background-color': step === 1 ? 'rgba(253,187,45,1)': 'rgba(34,193,195,0.15)'}"
                x-large
                v-on:click="stepChange(1)"
        >
            <v-icon
                    large
                    :color="step === 1 ? 'white' : ''"
            >
            mdi-cloud-upload
            </v-icon>
        </v-btn>
        <v-divider/>
        <v-btn
                :disabled="!filesToBeSent.length"
                class="rounded-xl"
                :elevation="step === 2 ? 0 : 10"
                :style="{'background-color': step === 2 ? 'rgba(253,187,45,1)': 'rgba(34,193,195,0.15)'}"                x-large
                v-on:click="stepChange(2)"
        >
            <v-icon
                    large
                    :color="step === 2 ? 'white' : ''"
            >
                mdi-table-headers-eye
            </v-icon>

        </v-btn>
        <v-divider />
        <v-btn
                :disabled="!filesToBeSent.length"
                class="rounded-xl"
                :elevation="step === 3 ? 0 : 10"
                :style="{'background-color': step === 3 ? 'rgba(253,187,45,1)': 'rgba(34,193,195,0.15)'}"                x-large
                v-on:click="stepChange(3)"
        >
            <v-icon
                    :color="step === 3 ? 'white' : ''"
                    large
            >
                mdi-table-sync
            </v-icon>

        </v-btn>

        <v-divider/>
        <v-btn
                class="rounded-xl"
                :disabled="!filesToBeSent.length"
                :elevation="step === 4 ? 0 : 10"
                :style="{'background-color': step === 4 ? 'rgba(253,187,45,1)': 'rgba(34,193,195,0.15)'}"                x-large
                v-on:click="stepChange(4)"
        >
            <v-icon
                    :color="step === 4 ? 'white' : ''"
                    large
            >
                mdi-send-circle-outline
            </v-icon>

        </v-btn>

    </v-sheet>
</template>

<script>
    export default {
        name: "StepBreadCrumbs",
        props: ['step', 'stepChange', 'filesToBeSent'],
    }
</script>

<style scoped>
    .dot {
        height: 70px;
        width: 70px;
        border-radius: 50%;
    }
</style>
