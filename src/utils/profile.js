import axios from "axios";
import {getURL} from "./settings";
import eventBus from "./eventBus";

class Profile {
    compare = [];
    cart = [];
    favourite = [];

    constructor(session, login, password) {
        this.session = session;
        this.login = login;
        this.password = password;
    }

    tryAuth() {
        axios.post(getURL('/login'), {login: this.login, password: this.password}).then(response => {
            this.session = response.session;
        })
    }

    loadCart() {

    }

}

function openCart() {
    eventBus.$emit('stack-panel-open', 'cart', {})
}
function openFavourite() {
    eventBus.$emit('stack-panel-open', 'favourite', {})
}
function openCalculator() {
    eventBus.$emit('stack-panel-open', 'calculate', {})
}
function openSearch() {
    eventBus.$emit('stack-panel-open', 'search', {})
}
function openCompare() {

}

export {Profile, openCart, openCalculator, openFavourite, openSearch, openCompare}
