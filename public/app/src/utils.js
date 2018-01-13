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
    simplemde.codemirror.on("change", () => {
        const val = simplemde.value()
        window.localStorage.setItem('content', val);
        clearTimeout(timeout)
        timeout = window.setTimeout(() => {
            par.querySelector('iframe').contentWindow.postMessage("new_content", "*");
        }, 1000);
    });
}

export function addMessageListener(par = null) {
    if (!par) return;

    window.addEventListener('message', (e) => {
        par.innerHTML = '';
        par.innerHTML = `<iframe src="${e.data}"></iframe>`;
    }, false)
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
       window.location.href = 'stage.html?source='+token;
    })
}
