'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getHashDict = getHashDict;
function getHashDict() {
    var hashstr = window.location.search.substr(1);
    var hasharr = hashstr.split('&');
    return hasharr.reduce(function (hash, arg) {
        var bits = arg.split('=');
        hash[bits[0]] = bits[1];
        return hash;
    }, {});
};