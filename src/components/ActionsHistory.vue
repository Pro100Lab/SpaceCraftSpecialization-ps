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
                <v-row>
                    <v-col cols="2">
                        <v-icon>
                            mdi-account
                        </v-icon>
                    </v-col>
                    <v-col cols="10">
                        <v-card-text>
                            {{node.type}}: {{node.name}}
                        </v-card-text>
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
                        name: "Главный администратор",
                        type: "Вход"
                    }
                ]
            }
        }
    }
</script>

<style scoped>

</style>
