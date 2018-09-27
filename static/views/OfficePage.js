"use strict";

import Page from "./Page.js";
import PagePresenter from "../modules/PagePresenter";

export default class OfficePage extends Page {

    constructor() {
        super();
        // щелчок по карточке курса
        this.addRedirectOnButtons(
            {button: "course-card-1", nextPage: "course-page", pagePath: "/course"}
        );
        this.addEventsOnButtons();
        console.log("office")
    }

    static pagePath() {
        return "/office";
    }

    static pageBoxName() {
        return "office-page";
    }

    getForm() {
        return this.form;
    }

    addEventsOnButtons() {
        document.getElementById("to-courses-btn").onclick = () => {
            console.log("C1");
            document.getElementById("courses-desk").hidden = false;
            document.getElementById("to-quizes-btn").classList.remove("active");
            document.getElementById("quizes-desk").hidden = true;
            document.getElementById("to-courses-btn").classList.add("active");
        };

        document.getElementById("to-quizes-btn").onclick = () => {
            console.log("C2");
            document.getElementById("courses-desk").hidden = true;
            document.getElementById("to-quizes-btn").classList.add("active");
            document.getElementById("quizes-desk").hidden = false;
            document.getElementById("to-courses-btn").classList.remove("active");
        };
    }
}