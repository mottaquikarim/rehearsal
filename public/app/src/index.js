import {
    getHashDict,
    setSauce,
    setInitial,
    ajax,
    setCMChange,
    addMessageListener,
    onExport,
} from './utils';

export default function initIndex() {
    const simplemde = new SimpleMDE({
        autofocus: true,
    });

    const initialVal = window.localStorage.getItem('content');
    const sauce = window.location.hash.slice(1);

    setSauce(sauce, simplemde);
    setInitial(initialVal, simplemde);

    const par = document.querySelector('.js-content')
    setCMChange(simplemde, par);

    const exportBtn = document.querySelector('.js-export')
    exportBtn.addEventListener('click', onExport)

    const loadBtn = document.querySelector('.header-controls')
    loadBtn.addEventListener('click', e => {
        if (e.target.matches('.js-load')) {
            simplemde.value(window.localStorage.getItem('content_old'))
            e.target.remove();
        }
    })
}




