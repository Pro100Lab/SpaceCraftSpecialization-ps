<template>
    <v-card color="transparent" elevation="0">
        <v-card-title style="font-weight: normal; cursor: default">
            {{title}}
        </v-card-title>
        <v-card-actions class="d-flex " :class="isMobile ? 'flex-column align-center' :  'flex-row align-start' ">
            <v-date-picker
                    class="mr-4"
                    :allowed-dates="allowDate"
                    locale="ru-RU"
                    :selected-items-text="`${!dates[0] || !dates[1] ? '' : 'ночей: ' + nights}`"
                    v-model="dates"
                    range
            ></v-date-picker>
            <div class="d-flex flex-column mx-4" :class="isMobile ? 'py-4' : ''">
                <v-form v-model="datesFormValid" id="dates-menu">
                    <v-text-field required
                                  :rules="dateRule"
                                  type="date-local"
                                  label="Дата заезда"
                                  v-model="dates[0]"
                    >
                    </v-text-field>
                    <v-text-field
                            required
                            :rules="dateRule"
                            type="date-local"
                            label="Дата выезда"
                            v-model="dates[1]"
                    >
                    </v-text-field>
                    <v-text-field type="number" min="1" label="Количество гостей" v-model="peopleAmount">
                    </v-text-field>
                    <v-text-field required :rules="[v => v > 0 || 'Количество ночей должно быть больше 0' ]"
                                  type="number" min="1" label="Количество ночей" v-model="nights">
                    </v-text-field>
                </v-form>
                <v-btn :disabled="!datesFormValid" v-on:click="calculateCostAndPresent">Рассчитать цену</v-btn>
            </div>
            <v-divider vertical v-if="calculated" class="mx-4"></v-divider>
            <div v-if="calculated" class="d-flex flex-column align-start mx-4" id="variant-menu">
                <v-card dark color="transparent" >
                    <v-card-title class="text-break">
                        Варианты размещения
                    </v-card-title>
                    <template v-if="variantLoaded">
                        <template v-if="bookingVariants.length > 0">
                            <div :class="isMobile ? 'd-flex flex-row overflow-x-auto': 'd-flex flex-column align-center overflow-y-auto'"
                                 :style="isMobile ? {'max-width': '80vw;'} : {'max-height': '300px'}">
                                <v-sheet class="rounded-xxl" :class="isMobile ? 'mx-2' : 'my-2'" dark v-for="variant of bookingVariants" :key="`bookvar-${variant.id}`">
                                    <v-card-subtitle class="text-break">
                                        Гостей: {{variant.guests}}<br/>
                                        Ночей: {{variant.nights}}<br/>
                                        Количество комнат: {{variant.rooms}}

                                    </v-card-subtitle>
                                    <v-divider></v-divider>
                                    <v-card-subtitle>
                                        Тариф: <strong>{{variant.tariffName}}</strong><br/>
                                        Цена: <strong>{{variant.price}} р. </strong>
                                    </v-card-subtitle>
                                    <v-btn  class="rounded-xxl" block v-on:click="setBookingVariant(variant)">Выбрать</v-btn>
                                </v-sheet>
                            </div>
                        </template>
                        <template v-else>
                            <v-card-title>
                                Не нашлось свободных мест
                            </v-card-title>
                            <v-card-subtitle>
                                Попробуйте выбрать другую дату
                            </v-card-subtitle>
                        </template>
                    </template>
                    <template v-else>
                        <div class="d-flex flex-column align-center">
                            <v-progress-circular
                                    indeterminate
                                    color="red"
                            ></v-progress-circular>
                        </div>
                    </template>
                </v-card>
            </div>
            <v-divider vertical v-if="selectedBookingVariant" class="mx-4">
            </v-divider>
            <v-card class="elevation-0" dark color="transparent" v-if="selectedBookingVariant" id="contact-menu">
                <v-card-title class="text-break">
                    Контактные данные
                </v-card-title>
                <v-form v-model="contactFormValid">

                    <v-text-field required :rules="nameRule" v-model="contactInfo.name" label="Ваше имя">

                    </v-text-field>
                    <v-text-field required :rules="phoneRule" v-model="contactInfo.number" label="Номер телефона">

                    </v-text-field>
                </v-form>

                <v-divider></v-divider>
                <v-btn :disabled="!contactFormValid" v-on:click="letsBookIt" block>
                    <span v-if="!bookingProcess">Забронировать</span>
                    <v-progress-circular
                            v-else
                            indeterminate
                            color="red"
                    ></v-progress-circular>
                </v-btn>
            </v-card>
            <v-card v-if="bookedTexts" dark color="transparent" class="mx-6">
                <v-card-title class="text-break">
                    {{bookedTexts.title}}
                </v-card-title>
                <v-card-subtitle class="text-break">
                    {{bookedTexts.subtitle}}
                </v-card-subtitle>
            </v-card>
        </v-card-actions>
    </v-card>
</template>

<script>
    import axios from "axios";
    import {getURL} from "../../../utils/settings";

    export default {
        name: "BookingBlock",
        props: ['title'],
        data: () => {
            return {
                dates: [null, null],
                peopleAmount: 1,
                calculated: false,
                bookingVariants: [],
                variantLoaded: false,
                selectedBookingVariant: null,
                onlinePay: false,
                offlinePay: true,
                contactInfo: {
                    number: '',
                    name: '',
                    paymentMethod: null
                },
                datesFormValid: false,
                contactFormValid: false,
                bookedTexts: null,
                bookingProcess: false,
                nights: 1,
                dateRule: [
                    v => !!v || "Выберите дату",
                    v => !/\d{4}-\d{2}.\d{4}/.test(v) || 'Выберите дату в календаре',
                    v => v >= new Date().toISOString().substr(0, 10) || 'Дата должна быть больше текущей'
                ],
                nameRule: [
                    v => !!v || 'Имя обязательно',
                    v => v.length > 3 || 'Минимальная длина поля - 4 символа',
                    v => !/[\da-zA-Z]/.test(v) || 'Имя может содержать только русские буквы и пробелы'
                ],
                phoneRule: [
                    v => !!v || 'Телефон обязателен, иначе мы не сможем позвонить!',
                    v => v.length > 10 || 'Минимальная длина поля - 10 символов',
                    v => !/[a-zA-Zа-яА-ЯёЁ]/.test(v) || 'Телефон должен состоять из цифр и символов "(", ")", "-"'
                ],
            }
        },
        computed: {
            isMobile: function() {
                return window.innerWidth < 1280;
            }
        },
        methods: {
            allowDate(input)
            {
                return input >= new Date().toISOString().substr(0, 10)
            },
            letsBookIt()
            {
                this.bookingProcess = true;
                axios.post(getURL('session/checkout'), {
                    requisites: {
                        firstName: this.contactInfo.name,
                        lastName: '',
                        phone: this.contactInfo.number,
                        email: '',
                        address: '',
                        guests: this.selectedBookingVariant.guests,
                        nights: this.selectedBookingVariant.nights,
                        dateOpen: this.dates[0],
                        dateClose: this.dates[1],
                        comment: '',
                        paymentMethod: 'При заселении',
                    },
                    total: this.selectedBookingVariant.price,
                    places: this.selectedBookingVariant.places
                }).then(() => {
                    this.bookedTexts = {
                        title: 'Спасибо за выбор нашего хостела!',
                        subtitle: 'ближайшее время с вами свяжутся для подтверждения брони'
                    }

                    this.bookingProcess = false;
                    this.variantLoaded = false;
                    this.contactFormValid = false;
                    this.selectedBookingVariant = null;
                    this.calculated = false;
                    setTimeout(() => {
                        this.bookedTexts = null;
                    }, 3500)
                }).catch(() => {
                    this.bookedTexts = {
                        title: 'Во время бронирования возникла ошибка',
                        subtitle: 'Попробуйте немного подождать и повторить бронь'}

                    this.bookingProcess = false;
                });
    },
    setBookingVariant(variant)
    {
        console.log(variant);
        this.selectedBookingVariant = variant;

        if( this.isMobile )
        {
            const doc = document.getElementById('contact-menu')
            if(doc) {
                console.log('scroll by doc')
                window.scrollTo({top: doc.offsetTop, behavior: 'smooth'})
            } else {
                console.log('scroll by half height')
                window.scrollTo({top: window.scrollY + window.innerHeight / 2, behavior: 'smooth'})
            }
        }
    },
    calculateCostAndPresent() {
        this.calculated = true;
        this.variantLoaded = false;

        axios.post(getURL('admin/order/calculate_variants'), {
            nights: this.nights,
            dateOpen: this.dates[0],
            dateClose: this.dates[1],
            guests: this.peopleAmount
        }).then(res => {
            this.bookingVariants = res.data;
            this.variantLoaded = true;
            if( this.isMobile )
            {
                const doc = document.getElementById('variant-menu')
                if(doc) {
                    console.log('scroll by doc')
                    window.scrollTo({top: doc.offsetTop, behavior: 'smooth'})
                } else {
                    console.log('scroll by half height')
                    window.scrollTo({top: window.scrollY + window.innerHeight / 2, behavior: 'smooth'})
                }
            }
        })
    }
    },
    watch: {
        dates() {
            const datesEntered = this.dates[0] && this.dates[1] && this.dates[0].length === 10 && this.dates[1].length === 10;
            if( !datesEntered )
                return;

            this.calculated = false;
            this.selectedBookingVariant = null;
            this.contactFormValid = false;
            this.variantLoaded = false;

            if( this.dates[0] > this.dates[1] ) {
                let tmp = this.dates[0];
                this.dates[0] = this.dates[1];
                this.dates[1] = tmp;
            }

            let nights = Math.ceil((Math.abs(new Date(this.dates[1]) - new Date(this.dates[0]))) / 3600000 / 24);
            if( isNaN(nights) )
                nights = 0;
            if( nights !== this.nights )
                this.nights = nights;
        },
        nights(newValue) {
            console.log(newValue)
            console.log(this.nights)
            if( this.dates[0] && this.dates[0].length === 10 )
            {
                console.log(this.dates[0])
                let finishDate = new Date(this.dates[0]);
                console.log(finishDate.toISOString().substr(0,10))

                finishDate.setDate(finishDate.getDate() + parseInt(newValue));

                this.dates[1] = finishDate.toISOString().substr(0,10);
                console.log(finishDate.toISOString().substr(0,10));

            }
        },
        peopleAmount(newValue) {
            this.calculated = false;
            this.selectedBookingVariant = null;
            this.contactFormValid = false;
            this.variantLoaded = false;

            if( parseInt(newValue) < 1 ) {
                this.peopleAmount = 1;
            }
        },
    }
    }
</script>

<style scoped>

    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(141, 35, 35, 0.3);
        -webkit-border-radius: 10px;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 10px;
        border-radius: 10px;
        background: rgba(58, 238, 202, 0.6);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }

    ::-webkit-scrollbar-thumb:window-inactive {
        background: rgba(20, 47, 13, 0.3);
    }

    .period-checked:hover {
        color: #00b8d4;
    }
</style>
