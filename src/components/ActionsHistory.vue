<template>
    <v-card>
        <v-card-title>
            <v-icon>
                mdi-calendar-account
            </v-icon>
            Недавняя активность
        </v-card-title>
        <v-list>
            <v-list-item v-for="node of history" :key="node.id">
                <v-row class="d-flex flex-row justify-center align-center">
                    <v-col cols="2">
                        <v-icon>
                            mdi-account
                        </v-icon>
                    </v-col>
                    <v-col cols="6">
                        <v-card-title>
                            {{node.type}}: {{node.name}}
                        </v-card-title>
                    </v-col>
                    <v-col cols="4">
                    <v-card-subtitle>{{node.date}}</v-card-subtitle>
                    </v-col>
                </v-row>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script>
    export default {
        name: "ActionsHistory",
        data: () => {
            return {
                history: [
                    {
                        id: 0,
                        name: "Admin",
                        type: "Вход",
                        date: '2023.04.24'
                    }
                ]
            }
        }
    }
</script>

<style scoped>

</style>
