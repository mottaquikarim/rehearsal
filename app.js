(() => {
    const simplemde = new SimpleMDE({
        autofocus: true,
    });

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

    const initialVal = window.localStorage.getItem('content');
    if (initialVal) {
        simplemde.value(initialVal)
    }
})()
