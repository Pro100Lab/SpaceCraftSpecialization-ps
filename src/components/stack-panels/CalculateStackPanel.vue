<template>
    <v-card class="fill-height">
        <v-card-title>
        Калькулятор мощности кондиционера
        </v-card-title>
        <v-divider/>
        <v-form class="mx-4 mt-4">
                <v-text-field
                    label="Площадь помещения, м²"
                    v-model="square"
                    :rules="floatRules"
                    required
                    outlined
            />
            <v-text-field
                    label="Высота помещения, м"
                    v-model="height"
                    :rules="floatRules"
                    required
                    outlined
            />
            <h4>Как много солнеченого света проникает в помещение</h4>
            <v-radio-group v-model="sunAmount" label="">
                <v-radio v-for="variant of sunVariants"
                         :key="variant.id"
                         :label="variant.value"
                         :value="variant.amount">

                </v-radio>
            </v-radio-group>
            <v-text-field
                    label="Количество людей в помещении"
                    v-model="peopleAmount"
                    type="number"
                    :rules="integerRules"
                    required
                    outlined
            />
            <v-text-field
                    label="Количество бытовых приборов в помещении"
                    v-model="deviceAmount"
                    type="number"
                    :rules="integerRules"
                    required
                    outlined
            />

        </v-form>
        <v-divider/>
        <v-text-field
                label="Необходимая расчётная мощность, кВт"
                v-model="calculatedPower"
                readonly
                outlined
                color="success"
                class="mx-4 my-4"
        />
        <div v-if="prop">
        <v-divider/>
            <v-btn color="blue" block class="elevation-0 mx-4 my-4">
                Применить
            </v-btn>
        </div>
    </v-card>
</template>

<script>
    export default {
        name: "CalculateStackPanel",
        props: ['prop'],
        data: () => {
           return {
               square: null,
               height: null,
               sunAmount: null,
               peopleAmount: null,
               deviceAmount: null,
               sunVariants: [{id: 0, value: 'затемнённое помещение', amount: 30},
                             {id: 1, value: 'средняя освещенность', amount: 35},
                             {id: 2, value: 'попадает много солнечного света', amount: 40}],
               floatRules: [
                   v => /[\d|\\.]*/.test(v) || 'Значение должно быть вещественным или целым числом'
               ],
               integerRules: [
                   v => /\d*/.test(v) || 'Значение должно быть целым числом'
               ]
           }
        },
        computed: {
            calculatedPower: function () {
                let Q1 = 0;
                let Q2 = 0;
                let Q3 = 0;

                if (this.square && this.height && this.sunAmount) {
                    Q1 = this.square * this.height * this.sunAmount / 1000;

                    if ( this.peopleAmount ) {
                        Q2 = 0.13 * this.peopleAmount;
                    }

                    if (this.deviceAmount) {
                        Q3 = 0.3 * this.deviceAmount;
                    }
                }

                let qAll = Q1 + Q2 + Q3;
                return qAll > 0 ? Math.round(qAll * 100) / 100 : null;
            }
        }
    }
</script>

<style scoped>

</style>
