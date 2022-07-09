class MixCollections {

    /**
     * Represents a collection of a set of key and value pairs. 
     * Each key in the MixedCollection must be unique, the same key cannot exist twice. 
     * Items in the collection can be accessed by the key.
     */

    constructor() {

        var LMe = this;

        LMe.FCollection = {};
    }

    add(p_key, p_value) {

        this.FCollection[p_key] = p_value;
    }

    get(p_key) {

        return this.FCollection[p_key];
    }

    contains(p_key) {

        return this.FCollection.hasOwnProperty(p_key);
    }
}

export default MixCollections;