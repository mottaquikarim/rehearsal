/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["initPage"] = initPage;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stage__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__slides__ = __webpack_require__(4);




const enums = {
    INDEX: 1,
    STAGE: 2,
    SLIDES: 3,
}

function initPage() {
    const page = document.querySelector('body')

    if (page.classList.contains('js-index')) {
        return Object(__WEBPACK_IMPORTED_MODULE_0__index__["a" /* default */])() && enums.INDEX;
    }

    if (page.classList.contains('js-stage')) {
        return Object(__WEBPACK_IMPORTED_MODULE_1__stage__["a" /* default */])() && enums.STAGE;
    }

    if (page.classList.contains('js-slides')) {
        return Object(__WEBPACK_IMPORTED_MODULE_2__slides__["a" /* default */])() && enums.SLIDES;
    }
}

initPage()


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = initIndex;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(2);


function initIndex() {
    console.log('index')
}

const simplemde = new SimpleMDE({
    autofocus: true,
});

const initialVal = window.localStorage.getItem('content');
const hashdict = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* getHashDict */])();
const sauce = hashdict['source']
if (sauce) {
    window.localStorage.setItem('jsonId', sauce);
    window.fetch("https://api.myjson.com/bins/"+sauce)
        .then(data => data.json())
        .then(json_ => {
            const {d} = json_;
            if (!d) {
                title.innerHTML = `✋ Failed To Load`
                alert('✋ Sorry, could not load data, defaulting to localstorage');
                return;
            }
            simplemde.value(d)
        })
}

if (initialVal) {
    simplemde.value(initialVal)
}
else {
    window.localStorage.setItem('content', document.querySelector('textarea').value);
}

const par = document.querySelector('iframe').parentNode
let timeout = null;
simplemde.codemirror.on("change", () => {
    const val = simplemde.value()
    window.localStorage.setItem('content', val);
    clearTimeout(timeout)
    timeout = window.setTimeout(() => {
        par.querySelector('iframe').contentWindow.postMessage("new_content", "*");
    }, 1000);
});

window.addEventListener('message', (e) => {
    par.innerHTML = '';
    par.innerHTML = `<iframe src="${e.data}"></iframe>`;
}, false)

const exportBtn = document.querySelector('.js-export')
const ajax = (met, url, body = null) => new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open(met, url);
    xhr.onload = e => res(e)
    xhr.onerror = e => rej(e)
    xhr.setRequestHeader('Content-Type', "application/json; charset=utf-8");
    xhr.send(body)
})

exportBtn.addEventListener('click', e => {
    const id_ = window.localStorage.getItem('jsonId')
    const d = window.localStorage.getItem('content') || null;
    console.log(d)
    if (!d) return;

    const jsond = JSON.stringify({
        'd': d,
    });

    const ret = !id_ ?
        ajax('POST', 'https://api.myjson.com/bins', jsond) :
        ajax('PUT', 'https://api.myjson.com/bins/'+id_, jsond);
        
    ret.then(data => {
        console.log(data);
        const response = data.currentTarget.responseText;
        console.log(response)
        if (!response) return;

        const {uri} = JSON.parse(response);
        const token = uri ?
            uri.split('/').pop() :
            window.localStorage.getItem('jsonId');

       window.localStorage.setItem('jsonId', token);
       window.location.href = 'stage.html?source='+token;
    })
    
});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getHashDict;
function getHashDict() {
    const hashstr = window.location.search.substr(1);
    const hasharr = hashstr.split('&')
    return hasharr.reduce((hash, arg) => {
        const bits = arg.split('=')
        hash[bits[0]] = bits[1]
        return hash;
    }, {});
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = initStage;
function initStage() {
    console.log('stage')
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = initSlides;
function initSlides() {
    console.log('slides')
}


/***/ })
/******/ ]);