import MixCollections from './utils/MixCollections.js';

class Tnl {

    constructor() {

        var LMe = this;

        LMe.FUtils = null;
    }

    MixCollections() {

        //User will create instance of this MixCollections every time
        return MixCollections;
    }

    isEmpty(value, allowEmptyString) {
        /**
         * Returns true if the passed value is empty, false otherwise. The value is deemed to be empty if it is either:
         *
         * - `null`
         * - `undefined`
         * - a zero-length array
         * - a zero-length string (Unless the `allowEmptyString` parameter is set to `true`)
         *
         * @param {Object} value The value to test.
         * @param {Boolean} [allowEmptyString=false] `true` to allow empty strings.
         * @return {Boolean}
         */

        return (value == null) || (!allowEmptyString ? value === '' : false) || (this.isArray(value) && value.length === 0);
    }

    isObjEmpty(object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    isArray(value) {
        /**
        * Returns `true` if the passed value is a JavaScript Array, `false` otherwise.
        *
        * @param {Object} target The target to test.
        * @return {Boolean}
        * @method
        */
        return toString.call(value) === '[object Array]';
    }

    isDate(value) {
        /**
        * Returns `true` if the passed value is a JavaScript Date object, `false` otherwise.
        * @param {Object} object The object to test.
        * @return {Boolean}
        */
        return toString.call(value) === '[object Date]';
    }

    cloneVar(item, cloneDom) {
        /**
         * Clone simple variables including array, {}-like objects, DOM nodes and Date without keeping the old reference.
         * A reference for the object itself is returned if it's not a direct descendant of Object.
         *
         * @param {Object} item The variable to clone
         * @param {Boolean} [cloneDom=true] `true` to clone DOM nodes.
         * @return {Object} clone
         */

        if (item === null || item === undefined) {
            return item;
        }

        // DOM nodes
        // recursively
        if (cloneDom !== false && item.nodeType && item.cloneNode) {
            return item.cloneNode(true);
        }

        var type = toString.call(item),
            i, j, k, clone, key;

        // Date
        if (type === '[object Date]') {
            return new Date(item.getTime());
        }

        // Array
        if (type === '[object Array]') {
            i = item.length;

            clone = [];

            while (i--) {
                clone[i] = this.cloneVar(item[i], cloneDom);
            }
        }
        // Object
        else if (type === '[object Object]' && item.constructor === Object) {
            clone = {};

            for (key in item) {
                clone[key] = this.cloneVar(item[key], cloneDom);
            }
            var enumerables = ['valueOf', 'toLocaleString', 'toString', 'constructor']
            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (item.hasOwnProperty(k)) {
                        clone[k] = item[k];
                    }
                }
            }
        }

        return clone || item;
    }

    // SetLocalStorage(p_key, p_value) {
    //     /**
    //      * @method SetLocalStorage
    //      * This method will set item in local storage
    //      */

    //     if (this.isEmpty(p_key) || this.isEmpty(p_value)) {

    //         return;
    //     }

    //     localStorage.setItem(p_key, p_value);
    // }

    // GetLocalStorage(p_key) {
    //     /**
    //      * @method GetLocalStorage
    //      * This method will return the item from local storage
    //      */

    //     if (this.isEmpty(p_key)) {

    //         return;
    //     }

    //     return localStorage.getItem(p_key);
    // }
}

export default new Tnl();