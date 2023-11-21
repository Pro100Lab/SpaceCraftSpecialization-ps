<template>
    <v-sheet height="300">
        <yandex-map
                class="fill-height"
                v-if="coords && balloon" :coords="coords" :zoom="17">
            <ymap-marker
                    marker-id="123"
                    :coords="coords"
                    :balloon-template="balloon"
            ></ymap-marker>
        </yandex-map>
    </v-sheet>
</template>

<script>
    import getLoader from "../../../utils/customizeOptions";

    export default {
        name: 'YandexMapBlock',
        data: () => {
            return {
                coords: null,
                balloon: null
            }
        },
        props: {
            content: {}
        },
        async beforeMount() {
            await getLoader().loadOptions();

            this.coords = [getLoader().getOption(['Common', 'Block', 'Map', 'Coords', 'x']),
                getLoader().getOption(['Common', 'Block', 'Map', 'Coords', 'y'])
            ];
            this.balloon = getLoader().getOption(['Common', 'Block', 'Map', 'Balloon']);
            console.log('coords: ', this.coords);
            console.log('balloon: ', this.balloon);
        }
    }
</script>
