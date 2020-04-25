window.Matt = {
    directives: {
        'm-text': (el,value) => {
            el.innerText = value;
        },
        'm-show': (el,value) => {
            el.style.display = value ? 'block' : 'none'
        }
    },

    start () {
        this.root = document.querySelector('[m-data]');

        this.rawData = this.getInitialData();

        this.data = this.observe(this.rawData);

        this.registerListeners();
        this.refreshDom();
    },

    getInitialData() {
        let dataString = this.root.getAttribute('m-data');
        return eval(`(${dataString})`);
    },

    observe(rawData) {
        let self = this;
        return new Proxy(rawData,{
            set(target, p, value) {
                target[p] = value;

                self.refreshDom();
            }
        });
    },

    registerListeners() {
        this.walkDom(this.root, el => {
            Array.from(el.attributes).forEach(attribute => {
                if(!attribute.name.startsWith('@')) { return }
                let event = attribute.name.replace('@','');

                el.addEventListener(event,() => {
                    new Function('data', `var result; with(data) { result = ${attribute.value} };return result`)(this.data)
                })
            })
        });
    },

    refreshDom() {
        this.walkDom(this.root, el => {
            Array.from(el.attributes).forEach(attribute => {
                if(!Object.keys(this.directives).includes(attribute.name)) { return }

                this.directives[attribute.name](el,
                    eval(`with (this.data) (${attribute.value})`)
                )
            })
        })
    },


    walkDom(el, callback) {
        callback(el);

        el = el.firstElementChild;

        while (el) {
            this.walkDom(el,callback);
            el = el.nextElementSibling;
        }
    }
}

window.Matt.start();