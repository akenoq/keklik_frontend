"use strict";

import PagePresenter from "./PagePresenter.js";

export default function linkOnButtons(...buttons) {
    buttons.forEach(button => {
        // document.querySelector("#" + button.button).addEventListener("touchend", function(e){
        //     e.preventDefault();
        //     e.target.click();
        // }, false);
        document.querySelector("#" + button.button).addEventListener("click", () => {
            PagePresenter.showOnlyOnePage(button.nextPage);
            history.pushState({}, "", button.pagePath);
        });
    });
}