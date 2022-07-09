export function isEmpty(value, allowEmptyString) {
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

    return (value == null) || (!allowEmptyString ? value === '' : false) || (isArray(value) && value.length === 0);
}

export function isObjEmpty(object) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

export function isArray(value) {
    /**
    * Returns `true` if the passed value is a JavaScript Array, `false` otherwise.
    *
    * @param {Object} target The target to test.
    * @return {Boolean}
    * @method
    */
    return toString.call(value) === '[object Array]';
}

export function isDate(value) {
    /**
    * Returns `true` if the passed value is a JavaScript Date object, `false` otherwise.
    * @param {Object} object The object to test.
    * @return {Boolean}
    */
    return toString.call(value) === '[object Date]';
}

export function ErrorObj(p_objErrorRecord) {

    p_objErrorRecord = p_objErrorRecord || {};

    p_objErrorRecord.success = false;
    p_objErrorRecord.message = p_objErrorRecord.message || 'Some errors occurred on the server';

    return p_objErrorRecord;
}

export function SuccessObj(p_objSuccessRecord) {

    p_objSuccessRecord = p_objSuccessRecord || {};

    p_objSuccessRecord.success = true;

    return p_objSuccessRecord;
}