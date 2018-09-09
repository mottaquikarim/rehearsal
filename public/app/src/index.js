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
    const hashdict = getHashDict();
    const sauce = hashdict['source'];

    setSauce(sauce, simplemde);
    setInitial(initialVal, simplemde);

    const par = document.querySelector('iframe').parentNode
    setCMChange(simplemde, par);
    addMessageListener(par);

    const exportBtn = document.querySelector('.js-export')
    exportBtn.addEventListener('click', onExport)
}




