"use strict";

import Page from "./Page.js";
import PagePresenter from "../modules/PagePresenter";
import globalBus from "../modules/globalBus";

export default class GameTeacherPage extends Page {

    constructor() {
        super();
        this.addEventsOnButtons();
        console.log("teacher")
    }

    static pagePath() {
        return "/teacher";
    }

    static pageBoxName() {
        return "teacher-page";
    }

    attachRedirect() {
        this.addRedirectOnButtons(
            {button: "start-game-btn", nextPage: "play-page-manage", pagePath: "/teacher"}
        );
        console.log("add redirect");
    }

    addEventsOnButtons() {
        document.getElementById("next-question-btn").onclick = () => {
            globalBus().gameManager.switchNext();
        };
    }

    renderQuestion(ws_dataObj) {
        document.getElementById("question-preview").innerHTML = ws_dataObj
            .payload
            .data
            .current_question
            .question;
    }

    renderFinish(ws_dataObj) {
        document.getElementById("question-preview").innerHTML = "Викторина завершена";
        // печать результатов
    }
}