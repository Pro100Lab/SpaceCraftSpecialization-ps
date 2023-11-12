import axios from "axios";
import {getURL} from "./settings";
import eventBus from "./eventBus";

class Profile {
    compare = [];
    cart = [];
    favourite = [];

    authorized = false;
    user = {};

    constructor() {
        this.session = window.localStorage.getItem('token') || null;
        if( Profile._instance)
            return Profile._instance;

        Profile._instance = this;

        this.trySession();
    }

    logOut() {
        window.localStorage.setItem('token', '');
        this.authorized = false;
        this.user = {};

        eventBus.$emit('user/log-out');
    }

    trySession() {
        axios.post(getURL('user/auth'), {token: this.session}, {withCredentials: true}).then(response => {
            this.authorized = response.data.success;
            if(this.authorized) {
                eventBus.$emit('authorized');
                this.user = response.data.user;
            } else {
                eventBus.$emit('authorization-failed');
            }
        })
    }

    tryAuth(login, password) {
        axios.post(getURL('user/auth'), {login, password}, {withCredentials: true}).then(response => {
            this.session = response.data.session;
            this.authorized = response.data.success;

            if(this.authorized) {
                window.localStorage.setItem('token', this.session);
                this.user = response.data.user;
                eventBus.$emit('authorized');
            } else {
                eventBus.$emit('authorization-failed');
            }
        })
    }

    tryRegister(profile) {
        axios.post(getURL('user/register'), {user: profile, action: 'create'}, {withCredentials: true}).then(response => {
            this.session = response.data.session;
            this.authorized = response.data.success;
            if(this.authorized) {
                this.user = response.data.user;
                window.localStorage.setItem('token', this.session);
                eventBus.$emit('authorized');
                this.refresh();
            }
        })
    }

    refresh() {
        this.trySession();
    }

    update(newProfile) {
        axios.post(getURL('user/profile'), {user: newProfile, action: 'update'}, {withCredentials: true}).then(() => {
            eventBus.$emit('user/profile-updated');
            this.refresh();
        })
    }

    loadCart() {

    }
}

export function getUser() {
    return new Profile();
}

function openCart() {
    eventBus.$emit('stack-panel-push', 'cart', {})
}
function openFavourite() {
    eventBus.$emit('stack-panel-push', 'favourite', {})
}
function openCalculator() {
    eventBus.$emit('stack-panel-push', 'calculate', {})
}
function openSearch() {
    eventBus.$emit('stack-panel-push', 'search', {})
}
function openCompare() {

}

export {Profile, openCart, openCalculator, openFavourite, openSearch, openCompare}
