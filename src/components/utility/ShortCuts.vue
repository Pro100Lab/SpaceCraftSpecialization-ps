<template>
    <div>
        <transition name="slide-fade" v-if="btnsPos ==='right'">
            <div id="helpers-right" v-if="scY > 300 " :style="{
                'position': 'fixed',
                'bottom':  '20px',
                'right': '40px',
                'z-index': 1}">
                <v-icon
                        class="mx-2"
                        large
                        :ripple="true"
                        v-on:click="toTop()">mdi-chevron-double-up</v-icon>
            </div>
        </transition>
        <transition v-if="btnsPos ==='left'">
            <div id="helpers-left" v-if="scY > 300" :style="{
                'position': 'fixed',
                'bottom':  '20px',
                'left': '5px',
                'z-index': 1}">
                <v-icon
                        style="font-size: 60px"
                        class="mx-2"
                        color="white"
                        large
                        :ripple="true"
                        v-on:click="toTop()">mdi-chevron-double-up</v-icon>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "ShortCuts",
        data: () => {
          return {
              btnsPos: 'right',
              scY: 0,
              scTimer: 0,
          }
        },
        methods: {
            handleScroll: function () {
                if (this.scTimer) return;
                this.scTimer = setTimeout(() => {
                    this.scY = window.scrollY;
                    clearTimeout(this.scTimer);
                    this.scTimer = 0;
                }, 100);
            },
            toTop: function () {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            },
            calculateColor() {
                this.btnsPos = window.innerWidth > 1366 ? 'right' : 'left';
            }
        },
        mounted() {
            this.calculateColor();
            window.addEventListener('scroll', this.handleScroll);
            window.addEventListener('resize', () => {
                this.calculateColor();
            })
        }
    }
</script>

<style scoped>
    .slide-fade-enter-active {
        transition: all .3s;
    }
    .slide-fade-leave-active {
        transition: all .3s;
    }
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(200px);
        opacity: 0;
    }
</style>
