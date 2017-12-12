(() => {
    const getHashDict = () => {
        const hashstr = window.location.search.substr(1);
        const hasharr = hashstr.split('&')
        return hasharr.reduce((hash, arg) => {
            const bits = arg.split('=')
            hash[bits[0]] = bits[1]
            return hash;
        }, {});
    };

    const simplemde = new SimpleMDE({
        autofocus: true,
    });

    const initialVal = window.localStorage.getItem('content');
    const hashdict = getHashDict();
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

})()

/*
    const exportBtn = document.querySelector('.js-export')
    const jsonEditor = document.querySelector('.js-json-editor')
    const mdEditor = document.querySelector('.js-md-editor')
    exportBtn.addEventListener('click', e => {
        mdEditor.classList.add('hidden')
        jsonEditor.classList.remove('hidden')
        // create the editor
        var container = document.querySelector(".js-json-container");
        var options = {
            'mode':  'code',
            'navigationBar': false,
            'statusBar': false,
        };
        var editor = new JSONEditor(container, options);

        // set json
        var json = {
            "content_source": "URL_OF_CONTENT_SOURCE_HERE"
        };
        editor.set(json);
    });

*/
