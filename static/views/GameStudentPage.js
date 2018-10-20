"use strict";

import Page from "./Page.js";
import PagePresenter from "../modules/PagePresenter";

export default class GameStudentPage extends Page {

    constructor() {
        super();
        this.addEventsOnButtons();
        console.log("student")
    }

    static pagePath() {
        return "/play";
    }

    static pageBoxName() {
        return "play-page";
    }

    attachRedirect() {
        this.addRedirectOnButtons(
            {button: "join-game-btn", nextPage: "play-page", pagePath: "/play"}
        );
        console.log("add redirect");
    }

    renderQuestion(ws_dataObj) {
        document.getElementById("play-page-header").innerHTML = ws_dataObj.payload.data.quiz.title;
        document.getElementById("play-page-question").innerHTML =
            "Вопрос "+
            ws_dataObj.payload.data.current_question.number + ": " +
            ws_dataObj.payload.data.current_question.question;
    }

    renderFinish() {
        document.getElementById("play-page-header").innerHTML = "ВИКТОРИНА ЗАВЕРШЕНА";
        document.getElementById("play-page-question").innerHTML = "ВИКТОРИНА ЗАВЕРШЕНА";
    }

    addEventsOnButtons() {

    }
}