<template>
    <div>
        <template v-for="(line, index) in items" >
            <v-sheet
                    :key="`price-line${index}-${line.name}`"
                    :color="line.color"
                    class="py-1 px-4 d-flex flex-row justify-space-around"
            >
                <v-card-title
                        class="text-break text-right py-0" style="font-weight: 300; width: 70vw;"
                        v-html="line.name"
                />
                <v-card-title
                        v-if="line.price"
                        class="text-break text-left py-0" style="font-weight: 500; width: 30vw;"
                        v-html="normalizePrice(line.price) + ` Руб.`"
                />
            </v-sheet>
        </template>
    </div>
</template>
<script>
    import {getStatic, normalizePrice} from "../../../utils/settings";

    export default {
        name: 'PricesBlock',
        props: {
            content: {}
        },
        data: () => {
            return {
                items: [],
                colors: ['rgba(175, 238, 238, 0.3)', 'rgba(135, 206, 235, 0.3)']
            }
        },
        methods: {
            getStatic, normalizePrice
        },
        mounted() {
            const items = this.content.Description.split('\n');
            items.forEach((item, index) => {
                const priceTokens = item.split(':');
                if(priceTokens.length < 2) {
                    console.error('price tokens length != 2: ', priceTokens)
                }

                this.items.push({
                    name: priceTokens[0],
                    price: priceTokens[1],
                    color: this.colors[index%2]
                })
            })
            console.log('price items: ', this.items);
        }
    }
</script>
