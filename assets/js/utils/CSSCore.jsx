'use strict';

const SPACE = ' ';
const RE_CLASS = /[\n\t\r]/g;

let norm = (elemClass) => {
    return (SPACE + elemClass + SPACE).replace(RE_CLASS, SPACE);
};

export default {
    addClass(elem, className) {
        elem.className += ' ' + className;
    },

    removeClass(elem, needle) {
        const elemClass = elem.className.trim();
        let className = norm(elemClass);
        needle = needle.trim();
        needle = SPACE + needle + SPACE;

        while (className.indexOf(needle) >= 0) {
            className = className.replace(needle, SPACE);
        }
        elem.className = className.trim();
    },

    hasClass(elem, targetClass) {
        return (SPACE + elem.className + SPACE).indexOf(SPACE + targetClass + SPACE) >= 0;
    }
}
