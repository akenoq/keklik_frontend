"use strict";

import globalBus from "../modules/globalBus";
import debugLog from "../modules/debugLog";

export default class ModalWindow {
    constructor() {
        globalBus().modalWindow = this;
        this.modalWind = document.getElementById("modal-window");
        this.headerBox = document.getElementById("modal-header-box");
        this.bodyBox = document.getElementById("modal-body-box");
        this.okBtn = document.getElementById("ok-delete-btn");
        this.cancelBtn = document.getElementById("cancel-delete-btn");
        this.closeBtn = document.getElementById("close-delete-btn");
    }

    clickOk(func) {
        this.okBtn.onclick = () => {
            debugLog("OK");
            func();
            this.hide();
        };
    }

    clickCancel() {
        this.cancelBtn.onclick = () => {
            debugLog("ОТМЕНА");
            this.hide();
        };
        this.closeBtn.onclick = () => {
            debugLog("ЗАКРЫТЬ");
            this.hide();
        }
    }

    addEventsOnButtons(func) {
        debugLog("modal click");
        this.clickOk(func);
        this.clickCancel();
    }

    setHeader(data) {
        this.headerBox.innerHTML = data;
    }

    setBody(data) {
        this.bodyBox.innerHTML = data;
    }

    show() {
        this.modalWind.setAttribute('class', 'modal fade show');
        this.modalWind.setAttribute('style', 'display: block');
    }

    hide() {
        this.modalWind.setAttribute('class', 'modal fade');
        this.modalWind.setAttribute('style', 'display: none');
    }
}