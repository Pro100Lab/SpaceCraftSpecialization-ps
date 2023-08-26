<template>
    <v-card style="background-color: lightblue; border-radius: 7px" class="card-gradient ">
        <v-card-actions style="background-color: rgba(0, 51, 204, 0.3); height: 40px">
        <v-card-title style="color: white; font-size: 18px">
            {{title}}
        </v-card-title>
            </v-card-actions>
        <v-card-actions style="height: 100px">
            <v-icon large style="font-size: 50px">
                {{icon}}
            </v-icon>
            <v-spacer/>
            <v-card-subtitle style="color: white; font-size: 50px">
                {{amount}}
            </v-card-subtitle>
        </v-card-actions>
        <v-card-actions style="background-color: rgba(0, 51, 204, 0.3)">
            <v-btn color="transparent" elevation="0" :to="link">
                {{action}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        name: "StatisitcCard",
        props: ['title', 'icon', 'amount', 'action', 'link']
    }
</script>

<style scoped>
    .card-gradient {
        background: linear-gradient(
                rgba(0, 51, 204, 0.5),
                rgba(51, 204, 255, 0.3),
                rgba(153, 204, 255, 0.5)
        )
    }
</style>
