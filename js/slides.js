(() => {
    const fetchMarkdown = () => {
        const data = window.localStorage.getItem('content');

        if (!data) {
            document.querySelector('title').innerHTML = `✋ Failed To Load`;
            alert('✋ Sorry, could not find data for slideshow, slides will not load. (Maybe type some stuff first?)');
            return;
        }
        
        const reveal = document.querySelector('.reveal section');
        reveal.innerHTML = `<textarea data-template>${data}</textarea>`;
    }

    const fetchLecture = () => {
        fetchMarkdown();
        Reveal.initialize({
            history: true,
            dependencies: [{
                src: 'https://cdn.jsdelivr.net/npm/reveal.js@3.6.0/plugin/markdown/marked.js',
                condition: () => !!document.querySelector( '[data-markdown]' ),
            }, {
                src: 'https://cdn.jsdelivr.net/npm/reveal.js@3.6.0/plugin/markdown/markdown.js',
                condition: () => !!document.querySelector( '[data-markdown]' ),
            }, {
                src: 'https://cdn.jsdelivr.net/npm/reveal.js@3.6.0/plugin/highlight/highlight.js',
                async: true,
                callback: () => hljs.initHighlightingOnLoad(),
            }]	
        });
    };
    
    // init 
    fetchLecture();
    window.addEventListener("message", (e) => {
        if (e.data !== "new_content") return;

        const {h,v} = Reveal.getIndices();
        const loc = window.location.href.split('#').shift();
        window.parent.postMessage(loc + '#/' + h + '/' + v, '*');
    }, false);
})();
