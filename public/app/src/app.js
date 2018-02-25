import initIndex from './index';
import initStage from './stage';
import initSlides from './slides';

const enums = {
    INDEX: 1,
    STAGE: 2,
    SLIDES: 3,
};

export function initPage() {
    const page = document.querySelector('body');

    if (page.classList.contains('js-index')) {
        initIndex();
        return enums.INDEX;
    }

    if (page.classList.contains('js-stage')) {
        initStage();
        return enums.STAGE;
    }

    if (page.classList.contains('js-slides')) {
        initSlides(); 
        return enums.SLIDES;
    }
}

initPage();

export {enums}
