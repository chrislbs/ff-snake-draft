'use strict';

import _ from 'lodash';
import moment from 'moment';

// Builds a url encoded query string from an object
export function buildProps(obj) {
    // TODO: make this more robust
    return Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a;},[]).join('&');
}

// Work out the decimal separator so we can correctly format numbers in IE
const _decimalSeparator = /\./.test((1.1).toLocaleString())? '.' : ',';
const _decimalSeparatorRegex = new RegExp( '\\' + _decimalSeparator + '\\d+$');

// Returns a locale formated float if argument is numeric
export function format(str) {
    if (_.isNumber(str)) {
        let num = parseFloat(str);

        // If its not a whole number, limit it to 2 decimal places
        if (num % 1 !== 0) {
            num = num.toFixed(2);

            return num.toLocaleString();
        } else { // Make sure to trim any decimal places, because IE suxors
            return num.toLocaleString().replace(_decimalSeparatorRegex, '');
        }
    }
    return str;
}

export const tryToFixed = (n, precision) => _.isFinite(n) && n % 1 !== 0 ? n.toFixed(precision) : n;

export function xrange(start, end, step=1) {
    if(arguments.length === 1) {
        end = start - 1;
        start = 0;
    }
    return Array.apply(null, Array(Math.floor(((end - start) / step)) + 1)).map((_, i) => (i*step) + start);
}

// Find out where an element is on the page
export function getElementOffset(obj) {
    let curleft = 0;
    let curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    return {
        left : curleft,
        top : curtop
    };
}

// Utilities for making decisions based on screen size
export const XXS_SCREEN = 1;
export const XS_SCREEN = 2;
export const S_SCREEN = 3;
export const M_SCREEN = 4;
export const L_SCREEN = 5;
export const XL_SCREEN = 6;
export const XXL_SCREEN = 7;

export const screenSize = [
    {cutoff: 0, screen: XXS_SCREEN},
    {cutoff: 1280, screen: XS_SCREEN},
    {cutoff: 1366, screen: S_SCREEN},
    {cutoff: 1440, screen: M_SCREEN},
    {cutoff: 1536, screen: L_SCREEN},
    {cutoff: 1600, screen: XL_SCREEN},
    {cutoff: 1920, screen: XXL_SCREEN}
].filter(t => Math.max(document.documentElement.clientWidth, window.innerWidth || 0) >= t.cutoff).sort((a, b) => b.cutoff - a.cutoff)[0].screen;

// Utilities for transforming SVG's
export const msTranslateSVG = (selection, x, y) => {
    selection.attr('x', x).attr('y', y);
};

export const msRotateSVG = (selection, degrees) => {
    selection.style('filter', `progid:DXImageTransform.Microsoft.BasicImage(rotation=${degrees / 90})`);
};
