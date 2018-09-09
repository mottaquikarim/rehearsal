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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enums", function() { return enums; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stage__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__slides__ = __webpack_require__(4);




const enums = {
    INDEX: 1,
    STAGE: 2,
    SLIDES: 3,
};

function initPage() {
    const page = document.querySelector('body');

    if (page.classList.contains('js-index')) {
        Object(__WEBPACK_IMPORTED_MODULE_0__index__["a" /* default */])();
        return enums.INDEX;
    }

    if (page.classList.contains('js-stage')) {
        Object(__WEBPACK_IMPORTED_MODULE_1__stage__["a" /* default */])();
        return enums.STAGE;
    }

    if (page.classList.contains('js-slides')) {
        Object(__WEBPACK_IMPORTED_MODULE_2__slides__["a" /* default */])(); 
        return enums.SLIDES;
    }
}

initPage();




/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = initIndex;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(2);


function initIndex() {
    const simplemde = new SimpleMDE({
        autofocus: true,
    });

    const initialVal = window.localStorage.getItem('content');
    const sauce = window.location.hash.slice(1);

    Object(__WEBPACK_IMPORTED_MODULE_0__utils__["d" /* setSauce */])(sauce, simplemde);
    Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* setInitial */])(initialVal, simplemde);

    const par = document.querySelector('.js-content')
    Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* setCMChange */])(simplemde, par);

    const exportBtn = document.querySelector('.js-export')
    exportBtn.addEventListener('click', __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* onExport */])

    const loadBtn = document.querySelector('.header-controls')
    loadBtn.addEventListener('click', e => {
        if (e.target.matches('.js-load')) {
            simplemde.value(window.localStorage.getItem('content_old'))
            e.target.remove();
        }
    })
}






/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getHashDict */
/* harmony export (immutable) */ __webpack_exports__["d"] = setSauce;
/* harmony export (immutable) */ __webpack_exports__["c"] = setInitial;
/* unused harmony export ajax */
/* harmony export (immutable) */ __webpack_exports__["b"] = setCMChange;
/* harmony export (immutable) */ __webpack_exports__["a"] = onExport;
function getHashDict() {
    const hashstr = window.location.search.substr(1);
    const hasharr = hashstr.split('&')
    return hasharr.reduce((hash, arg) => {
        const bits = arg.split('=')
        hash[bits[0]] = bits[1]
        return hash;
    }, {});
};

function setSauce(sauce = null, simplemde = null) {
    // TODO: return promise, rmeove simplemde param
    if (!sauce) return;
    if (!simplemde) return;

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
            const oldC = window.localStorage.getItem('content')
            if (oldC && oldC !== d) {
                window.localStorage.setItem('content_old', oldC)
                const newNode = document.createElement('a');
                newNode.classList.add('js-load', 'header-button')
                newNode.innerHTML = "LOAD LOCAL CHANGES";
                newNode.style.color = 'red';
                document.querySelector('.header-controls').appendChild(newNode)
            }
            simplemde.value(d)
        })
}

function setInitial(initialVal = null, simplemde = null) {
    if (initialVal) {
        simplemde.value(initialVal)
    }
    else {
        window.localStorage.setItem('content', document.querySelector('textarea').value);
    }
}

function ajax(met, url, body = null) {
    return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.open(met, url);
        xhr.onload = e => res(e)
        xhr.onerror = e => rej(e)
        xhr.setRequestHeader('Content-Type', "application/json; charset=utf-8");
        xhr.send(body)
    })
}

function setCMChange(simplemde = null, par = null) {
    if (!simplemde) return
    if (!par) return

    let timeout = null;
    let scrollTimeout = null;
    let animationFrame = null;

    const _onChange = () => {
        const val = simplemde.value()
        window.localStorage.setItem('content', val);
        clearTimeout(timeout)
        timeout = window.setTimeout(() => {
            par.innerHTML = simplemde.options.previewRender(val);
           const span = document.querySelector('.js-status')
           span.innerHTML = "// Successfully saved to localStorage";
        }, 1000);
    }

    const easeInOutQuad =  (t, b, c, d) => {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    } 

    const defaultFn = (element, currentTime, start, change, duration, fn) => {
        element.scrollTop = fn(currentTime, start, change, duration);
    }

    const scrollTo = (element, to, duration, doneCb = null, cb = defaultFn)  => {
        var start = element.scrollTop,
            change = to - start,
            currentTime = 0,
            increment = 20;
            
        const animateScroll = function(){        
            currentTime += increment;
            cb(element, currentTime, start, change, duration, easeInOutQuad)
            if(currentTime < duration) {
                animationFrame = requestAnimationFrame(animateScroll, increment);
            }
            else {
                setTimeout(doneCb, 500);
            }
        };

        animateScroll();
    }

    simplemde.codemirror.on("change", _onChange)
    _onChange();

    let cmDisabled = false;
    let contDisabled = false;

    simplemde.codemirror.on("scroll", e => {
        if (cmDisabled) return;
        contDisabled = true;

        cancelAnimationFrame(animationFrame)
        clearTimeout(scrollTimeout)

        scrollTimeout = window.setTimeout(() => {

            const {doc} = e;
            const {cm, scrollTop} = doc;
            const {lastWrapHeight} = cm.display;
            const perc = scrollTop/lastWrapHeight;
            const ogHeight = Math.floor(par.getBoundingClientRect().height)
            console.log(Math.floor(ogHeight * perc), perc, lastWrapHeight, scrollTop, doc)
            scrollTo(par, Math.floor(ogHeight * perc), 500, () => {
                contDisabled = false; 
            })

        }, 500);
    })

    /*
    par.addEventListener("scroll", e => {

        if (contDisabled) return;
        cmDisabled = true;

        cancelAnimationFrame(animationFrame)
        clearTimeout(scrollTimeout)

        scrollTimeout = window.setTimeout(() => {
            const {target} = e;
            const scrollTop = target.scrollTop;
            const height = target.getBoundingClientRect().height;
            const perc = scrollTop / height;
            
            scrollTo(
                par,
                Math.floor(simplemde.codemirror.getScrollInfo().height * perc),
                500, 
                () => {
                    cmDisabled = false; 
                },
                (element, currentTime, start, change, duration, fn) => {
                    simplemde.codemirror.scrollTo(null, fn(currentTime, start, change, duration))
                }
            );

        }, 500)
    })
    */
}

function onExport(e) {
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
       window.location.hash = token;

       const span = document.querySelector('.js-status')
       span.innerHTML = "// Successfully saved to " + 
        "<a style='color: red;' href='" +
            window.location.href +
            "' target='blank'>" + 
                token + 
        "</a>";
    })
}


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