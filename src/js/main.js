import Queue from './queue.js';

window.onload = function() {

    function TopPlaceholdersAnimation(){
        var searchBarInputs = document.querySelectorAll(".search-bar__input");
        var searchBarInputsToptext = document.querySelectorAll(".search-bar__input-top-text");
    
        for(let i=0; i<searchBarInputs.length;i++) {
            searchBarInputs[i].addEventListener("focus", () => {
                searchBarInputsToptext[i].classList.remove("not-show");    
            });
    
            searchBarInputs[i].addEventListener("blur", () => {
                if(!searchBarInputs[i].value) {
                    searchBarInputsToptext[i].classList.add("not-show");
                }
            });
        }
    }

    function initInterface() {
        let InterfaceDOM = {
            inputLenght: document.querySelectorAll(".search-bar__input")[0],
            inputLimit: document.querySelectorAll(".search-bar__input")[1],
            buttonStart: document.querySelector(".search-bar__button"),
            progressBarText: document.querySelector(".content__progress-bar-text"),
            progressBarCount: document.querySelector(".content__progress-bar-text-count"),
            progressBarSize: document.querySelector(".content__progress-bar-text-size"),
            resultWindow: document.querySelector(".content__products")
        };

        return InterfaceDOM;
    }

    TopPlaceholdersAnimation();

    const InterfaceDOM = initInterface();
    new Queue(InterfaceDOM);


};

