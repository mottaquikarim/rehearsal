export function getHashDict() {
    const hashstr = window.location.search.substr(1);
    const hasharr = hashstr.split('&')
    return hasharr.reduce((hash, arg) => {
        const bits = arg.split('=')
        hash[bits[0]] = bits[1]
        return hash;
    }, {});
};

export function setSauce(sauce = null, simplemde = null) {
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

export function setInitial(initialVal = null, simplemde = null) {
    if (initialVal) {
        simplemde.value(initialVal)
    }
    else {
        window.localStorage.setItem('content', document.querySelector('textarea').value);
    }
}

export function ajax(met, url, body = null) {
    return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.open(met, url);
        xhr.onload = e => res(e)
        xhr.onerror = e => rej(e)
        xhr.setRequestHeader('Content-Type', "application/json; charset=utf-8");
        xhr.send(body)
    })
}

export function setCMChange(simplemde = null, par = null) {
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

export function onExport(e) {
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
