import axios from "axios";
import {getURL} from "./settings";

class OptionsLoader {
    allOptions = null;

    constructor() {
        if( OptionsLoader._instance)
            return OptionsLoader._instance;

        OptionsLoader._instance = this;

    }

    async loadOptions() {
        const prom = await axios.get(getURL('admin/draft/settings'));
        this.allOptions = prom.data;
    }

    getOption(path) {
        let currentObjects = this.allOptions;
        let value = null;
        for(const part of path) {
            const index = currentObjects.findIndex(obj => obj.name === part)
            if(index === null || !currentObjects[index] )
                return null;

            value = currentObjects[index].value;
            currentObjects = currentObjects[index].children;
        }

        console.log('find with path: ', Array.prototype.concat(path));
        console.log('value: ', value);
        return value;
    }

    getOptions(path) {
        let currentObjects = this.allOptions;
        for(const part of path) {
            const index = currentObjects.findIndex(obj => obj.name === part)
            if(index === null)
                return null;

            currentObjects = currentObjects[index].children;
        }

        console.log('find with path: ', Array.prototype.concat(path));
        console.log('value: ', currentObjects);
        return currentObjects;
    }
}

function getLoader() {
    return new OptionsLoader();
}
export default getLoader;
