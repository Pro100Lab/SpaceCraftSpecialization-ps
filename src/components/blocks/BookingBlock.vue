<template>
    <v-card color="transparent">
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
                <v-form v-model="datesFormValid">
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
            <div v-if="calculated" class="d-flex flex-column align-start mx-4">
                <v-card dark color="transparent">
                    <v-card-title class="text-break">
                        Варианты размещения
                    </v-card-title>
                    <v-sheet dark v-for="variant of bookingVariants" :key="`bookvar-${variant.id}`">
                        <v-card-subtitle class="text-break">
                            Гостей: {{peopleAmount}}<br/> Количество комнат: {{variant.roomsAmount}}<br/>
                        </v-card-subtitle>
                        <v-divider></v-divider>
                        <v-card-subtitle>
                            Цена: <strong>{{variant.price}} р. </strong>
                        </v-card-subtitle>
                        <v-btn block v-on:click="setBookingVariant(variant)">Выбрать</v-btn>
                    </v-sheet>
                </v-card>
            </div>
            <v-divider vertical v-if="selectedBookingVariant" class="mx-4">
            </v-divider>
            <v-card class="elevation-0" dark color="transparent" v-if="selectedBookingVariant">
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
                    Забронировать
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
    import {getURL} from "../../utils/settings";

    export default {
        name: "BookingBlock",
        props: ['title'],
        data: () => {
            return {
                dates: [null, null],
                peopleAmount: 1,
                calculated: false,
                bookingVariants: [],
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
                axios.post(getURL('session/checkout'), {
                    requisites: {
                        firstName: this.contactInfo.name,
                        lastName: '',
                        phone: this.contactInfo.number,
                        email: '',
                        address: '',
                        guests: this.peopleAmount,
                        dateOpen: this.dates[0],
                        dateClose: this.dates[1],
                        comment: '',
                        paymentMethod: 'При заселении',
                    },
                    total: this.selectedBookingVariant.price
                }).then(() => {
                    this.bookedTexts = {
                        title: 'Спасибо за выбор нашего хостела!',
                        subtitle: 'ближайшее время с вами свяжутся для подтверждения брони'
                    }

                    this.contactFormValid = false;
                    this.selectedBookingVariant = null;
                    this.calculated = false;
                    setTimeout(() => {
                        this.bookedTexts = null;
                    }, 3500)
                })
            },
            setBookingVariant(variant)
            {
                console.log(variant);
                this.selectedBookingVariant = variant;
            },
            calculateCostAndPresent() {
                this.calculated = true;

                this.bookingVariants = [];
                const price = ( this.nights > 3 ? 800 : 1000 ) * this.peopleAmount * this.nights;
                const roomsAmount = Math.ceil(this.peopleAmount / 4);
                let id = 0;
                this.bookingVariants.push({
                    'id': id, 'price': price, 'roomsAmount': roomsAmount
                });

                if( this.isMobile )
                {
                    window.scrollY = window.scrollY + window.innerHeight / 2;
                }
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

                if( parseInt(newValue) < 1 ) {
                    this.peopleAmount = 1;
                }
            }
        }
    }
</script>

<style scoped>

</style>
