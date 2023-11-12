import axios from "axios";
import {getURL} from "./settings";

class OptionsLoader {
    allOptions = null;
    prom = null;
    loading = false;
    loaded = false;

    constructor() {
        if( OptionsLoader._instance)
            return OptionsLoader._instance;

        OptionsLoader._instance = this;
    }

    async loadOptions() {
        if(this.loading)
            await this.resolve();

        if(!this.prom) {
            this.prom = axios.get(getURL('admin/draft/settings'));
            this.loading = true;
        }

        await this.resolve();
    }

    async resolve() {
        const res = await this.prom;
        this.allOptions = res.data;
        this.loading = false;
        this.loaded = true;
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

        return value;
    }

    getBool(path, isMobile = false) {
        if(!path || !path.length)
            return false;

        if(isMobile)
            path.push('Mobile');

        const option = this.getOption(path);
        return option === 'True';
    }

    getOptions(path) {
        let currentObjects = this.allOptions;
        for(const part of path) {
            const index = currentObjects.findIndex(obj => obj.name === part)
            if(index === -1)
                return [];

            currentObjects = currentObjects[index].children;
        }

        return currentObjects;
    }

    getAsObjects(path) {
        const options = this.getOptions(path);
        let propObjects = [];

        for(const option of options) {
            propObjects.push(this._propertiesAsObject(option))
        }

        return propObjects;
    }

    getAsObject(path, isMobile = false) {
        if(isMobile)
            path.push('Mobile');

        const options = this.getOptions(path);

        let propObjects = {};
        for(const option of options) {
            if(option.name === 'Mobile' && !isMobile)
                continue;
            propObjects = {...propObjects, ...this._propertiesAsObject(option)};
        }

        console.log('css props: ')
        console.log(propObjects)
        return propObjects;
    }

    _propertiesAsObject(option) {
        let propObject = {};

        propObject[option.name] = option.value;
        const children = option.children;

        if(!children)
            return propObject;

        for(const child of children) {
            propObject[child.name] = child.value;
        }

        return propObject;
    }
}

function getLoader() {
    return new OptionsLoader();
}
export default getLoader;
