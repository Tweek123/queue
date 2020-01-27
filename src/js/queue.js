class Queue {
    constructor(InterfaceDOM) {
        this.InterfaceDOM = InterfaceDOM;
        this.initEventListener();
    }

    initEventListener() {
        this.InterfaceDOM.buttonStart.addEventListener("click", () => {
            this.disableInterface();
            this.start();
        });
    }

    disableInterface() {
        this.InterfaceDOM.inputLenght.setAttribute("disabled","");
        this.InterfaceDOM.inputLimit.setAttribute("disabled","");
        this.InterfaceDOM.buttonStart.setAttribute("disabled","");
        this.InterfaceDOM.resultWindow.innerHTML = "";
        this.InterfaceDOM.progressBarText.classList.remove("not-show");

        this.InterfaceDOM.inputLenght.classList.add("input-disabled");
        this.InterfaceDOM.inputLimit.classList.add("input-disabled");
        this.InterfaceDOM.buttonStart.classList.add("button-disabled");
    }

    enableInterface() {
        this.InterfaceDOM.inputLenght.removeAttribute("disabled");
        this.InterfaceDOM.inputLimit.removeAttribute("disabled");
        this.InterfaceDOM.buttonStart.removeAttribute("disabled");

        this.InterfaceDOM.inputLenght.classList.remove("input-disabled");
        this.InterfaceDOM.inputLimit.classList.remove("input-disabled");
        this.InterfaceDOM.buttonStart.classList.remove("button-disabled");
    }

    readTextFile(file) { 
        return new Promise(resolve => {

            var rawFile = new XMLHttpRequest();
            rawFile.open("GET", file, false);
            rawFile.onreadystatechange = function ()
            {
                if(rawFile.readyState === 4)
                {
                    if(rawFile.status === 200 || rawFile.status == 0)
                    {
                        resolve(rawFile.responseText);
                    }
                }
            };
            rawFile.send(null);

        });
      }

    generateObjectsArray(textContent, textHeadLine, size) {
        let ends = textContent.match(/\.+|!|\?/g);
        let sentences = textContent.split(/\.+|!|\?/g);
        let obj;
        let ObjectsArray = new Array(size);

        for(let i =0; i<size;i++) { 

            let randOmSymb = this.getRndInteger(10,200);

            obj = {
                string: sentences[i] +ends[i],
                headLineText: textHeadLine.substring(0,randOmSymb), 
                index: i
            };

            ObjectsArray[i] = obj;
        }

        return ObjectsArray;
    }

    queue(ObjectsArray, mapper, limit) {

        let threads = [];
        
        for (let i = 0; i < limit; i++) {
            threads.push(this.createTask(ObjectsArray, mapper));
        }

        return Promise.all(threads);
    }

    mapper()  {new Promise((resolve) => setTimeout(() => {        
        
        resolve();

    }, Math.round(Math.random() * 9000) + 1000))};


    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }


    async createTask(ObjectsArray, mapper) {
        let nextObj = ObjectsArray.shift();
        if (!nextObj) return;
        
        let productDOM = this.createProduct();
        let headLineindex = nextObj.index + 1;

        productDOM.productHeadLine.innerText = headLineindex+ ". " + nextObj.headLineText;
        
        this.renderProduct(productDOM.product, this.InterfaceDOM);

        await mapper(nextObj);

        productDOM.productText.innerText = nextObj.string;   
        this.InterfaceDOM.progressBarCount.innerText = +this.InterfaceDOM.progressBarCount.innerText + 1; 

        return this.createTask(ObjectsArray, mapper, this.InterfaceDOM);
    }


    createProduct() {
        let product = document.createElement("div");
        product.className = "content__product-wrapper";

        let productHeadLine = document.createElement("h1");
        productHeadLine.className = "content__product-headline";

        let productText = document.createElement("p");
        productText.className = "content__product-text";

        product.appendChild(productHeadLine);
        product.appendChild(productText);

        let productDOM = {
            product: product,
            productHeadLine: productHeadLine,
            productText: productText,
        };

        return productDOM
    }

    renderProduct(product) {
        let lastElementInProducts = this.InterfaceDOM.resultWindow.childNodes[this.InterfaceDOM.resultWindow.childNodes.length];
        this.InterfaceDOM.resultWindow.insertBefore(product, lastElementInProducts);
    }

    start() {

        var size = this.InterfaceDOM.inputLenght.value;
        var limit = this.InterfaceDOM.inputLimit.value;
        var ObjectsArray;
        var textContent;
        var textHeadLine;
        var textReadPromises =  [];

        textReadPromises.push(this.readTextFile("../text/text.txt"));
        textReadPromises.push(this.readTextFile("../text/headLineText.txt"));

        Promise.all(textReadPromises).then(text => {
            textContent = text[0];
            textHeadLine = text[1];

            ObjectsArray = this.generateObjectsArray(textContent, textHeadLine, size);    
            
            this.InterfaceDOM.progressBarCount.innerText = 0; 
            this.InterfaceDOM.progressBarSize.innerText = size;

            let allPromises = this.queue(ObjectsArray, this.mapper, limit);

            allPromises.then(() => {
                this.enableInterface();
            });

        });
    }

}


export default Queue