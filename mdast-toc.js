!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.mdastTOC=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*
 * Dependencies.
 */

var slug = require('slug');

/**
 * Get the value of `node`.
 *
 * @param {Node} node
 * @return {string}
 */
function getValue(node) {
    return node &&
        (node.value ? node.value :
        (node.alt ? node.alt : node.title)) || '';
}

/**
 * Returns the text content of a node.
 * Checks `alt` or `title` when no value or children
 * exist.
 *
 * @param {Node} node
 * @return {string}
 */
function toString(node) {
    return getValue(node) ||
        (node.children && node.children.map(toString).join('')) ||
        '';
}

/**
 * Check if `node` is the main heading.
 *
 * @param {Node} node
 * @return {boolean}
 */
function isOpeningHeading(node, depth) {
    return depth === null && node && node.type === 'heading' &&
        /^(toc|table[ -]of[ -]contents?)$/i.test(toString(node));
}

/**
 * Check if `node` is the next heading.
 *
 * @param {Node} node
 * @param {number} depth
 * @return {boolean}
 */
function isClosingHeading(node, depth) {
    return depth && node && node.type === 'heading' && node.depth <= depth;
}

/**
 * Search a node for a location.
 *
 * @param {Node} root
 * @return {Object}
 */
function search(root) {
    var index = -1;
    var length = root.children.length;
    var depth = null;
    var lookingForToc = true;
    var map = [];
    var child;
    var headingIndex;
    var closingIndex;
    var value;

    while (++index < length) {
        child = root.children[index];

        if (lookingForToc) {
            if (isClosingHeading(child, depth)) {
                closingIndex = index;
                lookingForToc = false;
            }

            if (isOpeningHeading(child, depth)) {
                headingIndex = index + 1;
                depth = child.depth;
            }
        }

        if (!lookingForToc && child.type === 'heading') {
            value = toString(child);

            if (value) {
                map.push({
                    'depth': child.depth,
                    'value': value
                });
            }
        }
    }

    if (headingIndex) {
        if (!closingIndex) {
            closingIndex = length + 1;
        }

        /*
         * Remove current TOC.
         */

        root.children.splice(headingIndex, closingIndex - headingIndex);
    }

    return {
        'index': headingIndex || null,
        'map': map
    };
}

/**
 * Create a list.
 *
 * @return {Object}
 */
function list() {
    return {
        'type': 'list',
        'ordered': false,
        'children': []
    };
}

/**
 * Create a list item.
 *
 * @return {Object}
 */
function listItem() {
    return {
        'type': 'listItem',
        'loose': false,
        'children': []
    };
}

/**
 * Insert a `node` into a `parent`.
 *
 * @param {Object} node
 * @param {Object} parent
 */
function insert(node, parent) {
    var children = parent.children;
    var last = children[children.length - 1];
    var item;

    if (node.depth === 1) {
        item = listItem();

        item.children.push({
            'type': 'paragraph',
            'children': [
                {
                    'type': 'link',
                    'title': null,
                    'href': '#' + slug(node.value.toLowerCase()),
                    'children': [
                        {
                            'type': 'text',
                            'value': node.value
                        }
                    ]
                }
            ]
        });

        children.push(item);
    } else if (last && last.type === 'listItem') {
        insert(node, last);
    } else if (last && last.type === 'list') {
        node.depth--;

        insert(node, last);
    } else if (parent.type === 'list') {
        item = listItem();

        item.loose = true;

        insert(node, item);

        children.push(item);
    } else {
        item = list();
        node.depth--;

        insert(node, item);

        children.push(item);
    }
}

/**
 * Transform a list of heading objects to a markdown list.
 *
 * @param {Array.<Object>} map
 * @return {Object}
 */
function contents(map) {
    var minDepth = Infinity;
    var index = -1;
    var length = map.length;
    var table;

    /*
     * Fin minimum depth.
     */

    while (++index < length) {
        if (map[index].depth < minDepth) {
            minDepth = map[index].depth;
        }
    }

    /*
     * Normalize depth.
     */

    index = -1;

    while (++index < length) {
        map[index].depth -= minDepth - 1;
    }

    /*
     * Construct the main list.
     */

    table = list();

    /*
     * Add TOC to list.
     */

    index = -1;

    while (++index < length) {
        insert(map[index], table);
    }

    return table;
}

/**
 * Adds an example section based on a valid example
 * JavaScript document to a `Usage` section.
 *
 * @param {Node} node
 */
function toc(node) {
    var result = search(node);

    if (result.index === null || !result.map.length) {
        return;
    }

    /*
     * Add markdown.
     */

    node.children = [].concat(
        node.children.slice(0, result.index),
        contents(result.map),
        node.children.slice(result.index)
    );
}

/*
 * Expose `toc`.
 */

module.exports = toc;

},{"slug":3}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (root) {
// lazy require symbols table
var _symbols, removelist;
function symbols(code) {
    if (_symbols) return _symbols[code];
    _symbols = require('unicode/category/So');
    removelist = ['sign','cross','of','symbol','staff','hand','black','white']
        .map(function (word) {return new RegExp(word, 'gi')});
    return _symbols[code];
}

function slug(string, opts) {
    opts = opts || {};
    string = string.toString();
    if ('string' === typeof opts)
        opts = {replacement:opts};
    opts.mode = opts.mode || slug.defaults.mode;
    var defaults = slug.defaults.modes[opts.mode];
    ['replacement','multicharmap','charmap','remove'].forEach(function (key) {
        opts[key] = opts[key] || defaults[key];
    });
    if ('undefined' === typeof opts.symbols)
        opts.symbols = defaults.symbols;
    var lengths = [];
    Object.keys(opts.multicharmap).forEach(function (key) {
        var len = key.length;
        if (lengths.indexOf(len) === -1)
            lengths.push(len);
    });
    var code, unicode, result = "";
    for (var char, i = 0, l = string.length; i < l; i++) { char = string[i];
        if (!lengths.some(function (len) {
            var str = string.substr(i, len);
            if (opts.multicharmap[str]) {
                i += len - 1;
                char = opts.multicharmap[str];
                return true;
            } else return false;
        })) {
            if (opts.charmap[char]) {
                char = opts.charmap[char];
                code = char.charCodeAt(0);
            } else {
                code = string.charCodeAt(i);
            }
            if (opts.symbols && (unicode = symbols(code))) {
                char = unicode.name.toLowerCase();
                for(var j = 0, rl = removelist.length; j < rl; j++) {
                    char = char.replace(removelist[j], '');
                }
                char = char.replace(/^\s+|\s+$/g, '');
            }
        }
        char = char.replace(/[^\w\s\-\.\_~]/g, ''); // allowed
        if (opts.remove) char = char.replace(opts.remove, ''); // add flavour
        result += char;
    }
    result = result.replace(/^\s+|\s+$/g, ''); // trim leading/trailing spaces
    result = result.replace(/[-\s]+/g, opts.replacement); // convert spaces
    return result.replace(opts.replacement+"$",''); // remove trailing separator
};

slug.defaults = {
    mode: 'pretty',
};

slug.multicharmap = slug.defaults.multicharmap = {
    '<3': 'love', '&&': 'and', '||': 'or', 'w/': 'with',
};

// https://code.djangoproject.com/browser/django/trunk/django/contrib/admin/media/js/urlify.js
slug.charmap  = slug.defaults.charmap = {
    // latin
    'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE',
    'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I',
    'Î': 'I', 'Ï': 'I', 'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O',
    'Õ': 'O', 'Ö': 'O', 'Ő': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U',
    'Ü': 'U', 'Ű': 'U', 'Ý': 'Y', 'Þ': 'TH', 'ß': 'ss', 'à':'a', 'á':'a',
    'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c', 'è': 'e',
    'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ő': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u',
    'ý': 'y', 'þ': 'th', 'ÿ': 'y', 'ẞ': 'SS',
    // greek
    'α':'a', 'β':'b', 'γ':'g', 'δ':'d', 'ε':'e', 'ζ':'z', 'η':'h', 'θ':'8',
    'ι':'i', 'κ':'k', 'λ':'l', 'μ':'m', 'ν':'n', 'ξ':'3', 'ο':'o', 'π':'p',
    'ρ':'r', 'σ':'s', 'τ':'t', 'υ':'y', 'φ':'f', 'χ':'x', 'ψ':'ps', 'ω':'w',
    'ά':'a', 'έ':'e', 'ί':'i', 'ό':'o', 'ύ':'y', 'ή':'h', 'ώ':'w', 'ς':'s',
    'ϊ':'i', 'ΰ':'y', 'ϋ':'y', 'ΐ':'i',
    'Α':'A', 'Β':'B', 'Γ':'G', 'Δ':'D', 'Ε':'E', 'Ζ':'Z', 'Η':'H', 'Θ':'8',
    'Ι':'I', 'Κ':'K', 'Λ':'L', 'Μ':'M', 'Ν':'N', 'Ξ':'3', 'Ο':'O', 'Π':'P',
    'Ρ':'R', 'Σ':'S', 'Τ':'T', 'Υ':'Y', 'Φ':'F', 'Χ':'X', 'Ψ':'PS', 'Ω':'W',
    'Ά':'A', 'Έ':'E', 'Ί':'I', 'Ό':'O', 'Ύ':'Y', 'Ή':'H', 'Ώ':'W', 'Ϊ':'I',
    'Ϋ':'Y',
    // turkish
    'ş':'s', 'Ş':'S', 'ı':'i', 'İ':'I',
    'ğ':'g', 'Ğ':'G',
    // russian
    'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ё':'yo', 'ж':'zh',
    'з':'z', 'и':'i', 'й':'j', 'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o',
    'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'х':'h', 'ц':'c',
    'ч':'ch', 'ш':'sh', 'щ':'sh', 'ъ':'u', 'ы':'y', 'ь':'', 'э':'e', 'ю':'yu',
    'я':'ya',
    'А':'A', 'Б':'B', 'В':'V', 'Г':'G', 'Д':'D', 'Е':'E', 'Ё':'Yo', 'Ж':'Zh',
    'З':'Z', 'И':'I', 'Й':'J', 'К':'K', 'Л':'L', 'М':'M', 'Н':'N', 'О':'O',
    'П':'P', 'Р':'R', 'С':'S', 'Т':'T', 'У':'U', 'Ф':'F', 'Х':'H', 'Ц':'C',
    'Ч':'Ch', 'Ш':'Sh', 'Щ':'Sh', 'Ъ':'U', 'Ы':'Y', 'Ь':'', 'Э':'E', 'Ю':'Yu',
    'Я':'Ya',
    // ukranian
    'Є':'Ye', 'І':'I', 'Ї':'Yi', 'Ґ':'G', 'є':'ye', 'і':'i', 'ї':'yi', 'ґ':'g',
    // czech
    'č':'c', 'ď':'d', 'ě':'e', 'ň': 'n', 'ř':'r', 'š':'s', 'ť':'t', 'ů':'u',
    'ž':'z', 'Č':'C', 'Ď':'D', 'Ě':'E', 'Ň': 'N', 'Ř':'R', 'Š':'S', 'Ť':'T',
    'Ů':'U', 'Ž':'Z',
    // polish
    'ą':'a', 'ć':'c', 'ę':'e', 'ł':'l', 'ń':'n', 'ś':'s', 'ź':'z',
    'ż':'z', 'Ą':'A', 'Ć':'C', 'Ę':'E', 'Ł':'L', 'Ń':'N', 'Ś':'S',
    'Ź':'Z', 'Ż':'Z',
    // latvian
    'ā':'a', 'ē':'e', 'ģ':'g', 'ī':'i', 'ķ':'k', 'ļ':'l', 'ņ':'n',
    'ū':'u', 'Ā':'A', 'Ē':'E', 'Ģ':'G', 'Ī':'I',
    'Ķ':'K', 'Ļ':'L', 'Ņ':'N', 'Ū':'U',
    // lithuanian
    'ė':'e', 'į':'i', 'ų':'u', 'Ė': 'E', 'Į': 'I', 'Ų':'U',
    // romanian
    'ț':'t', 'Ț':'T', 'ţ':'t', 'Ţ':'T', 'ș':'s', 'Ș':'S', 'ă':'a', 'Ă':'A',
    // currency
    '€': 'euro', '₢': 'cruzeiro', '₣': 'french franc', '£': 'pound',
    '₤': 'lira', '₥': 'mill', '₦': 'naira', '₧': 'peseta', '₨': 'rupee',
    '₩': 'won', '₪': 'new shequel', '₫': 'dong', '₭': 'kip', '₮': 'tugrik',
    '₯': 'drachma', '₰': 'penny', '₱': 'peso', '₲': 'guarani', '₳': 'austral',
    '₴': 'hryvnia', '₵': 'cedi', '¢': 'cent', '¥': 'yen', '元': 'yuan',
    '円': 'yen', '﷼': 'rial', '₠': 'ecu', '¤': 'currency', '฿': 'baht',
    "$": 'dollar', '₹': 'indian rupee',
    // symbols
    '©':'(c)', 'œ': 'oe', 'Œ': 'OE', '∑': 'sum', '®': '(r)', '†': '+',
    '“': '"', '”': '"', '‘': "'", '’': "'", '∂': 'd', 'ƒ': 'f', '™': 'tm',
    '℠': 'sm', '…': '...', '˚': 'o', 'º': 'o', 'ª': 'a', '•': '*',
    '∆': 'delta', '∞': 'infinity', '♥': 'love', '&': 'and', '|': 'or',
    '<': 'less', '>': 'greater',
};

slug.defaults.modes = {
    rfc3986: {
        replacement: '-',
        symbols: true,
        remove: null,
        charmap: slug.defaults.charmap,
        multicharmap: slug.defaults.multicharmap,
    },
    pretty: {
        replacement: '-',
        symbols: true,
        remove: /[.]/g,
        charmap: slug.defaults.charmap,
        multicharmap: slug.defaults.multicharmap,
    },
};

// Be compatible with different module systems

if (typeof define !== 'undefined' && define.amd) { // AMD
    // dont load symbols table in the browser
    Object.keys(slug.defaults.modes).forEach(function (key) {
        slug.defaults.modes[key].symbols = false;
    });
    define([], function () {return slug});
} else if (typeof module !== 'undefined' && module.exports) { // CommonJS
    symbols(); // preload symbols table
    module.exports = slug;
} else { // Script tag
    // dont load symbols table in the browser
    Object.keys(slug.defaults.modes).forEach(function (key) {
        slug.defaults.modes[key].symbols = false;
    });
    root.slug = slug;
}

}(this));

},{"unicode/category/So":2}]},{},[1])(1)
});