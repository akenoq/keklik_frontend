"use strict";

import Page from "./Page.js";
import PagePresenter from "../modules/PagePresenter";
import globalBus from "../modules/globalBus";

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
        let cur_question_id = ws_dataObj.payload.data.current_question.id;
        let answersLen = ws_dataObj.payload.data.current_question.variants.length;
        document.getElementById("play-page-ans-list").innerHTML = "";
        for (let i = 0; i < answersLen; i++){
            let variant_id = ws_dataObj.payload.data.current_question.variants[i].id;
            let varientInList = document.createElement('a');
            varientInList.setAttribute("class", "ans-variant list-group-item list-group-item-action list-group-item-info");
            varientInList.setAttribute("id", `ans-btn-${variant_id}`);
            document.getElementById("play-page-ans-list").appendChild(varientInList);
            document.getElementById(`ans-btn-${variant_id}`).innerHTML =
                ws_dataObj.payload.data.current_question.variants[i].variant;
            document.getElementById(`ans-btn-${variant_id}`).onclick = () => {
                console.log("______________click______________");
                globalBus().gameManager.sendAnswer(variant_id, cur_question_id);
            }
        }
    }

    renderWaitingStart() {
        document.getElementById("play-page-header").innerHTML = "Ожидание старта...";
        document.getElementById("play-page-question").innerHTML = "";
        document.getElementById("play-page-ans-list").innerHTML = "";
    }

    renderWaitingNext() {
        document.getElementById("play-page-header").innerHTML = "Следующий вопрос...";
        document.getElementById("play-page-question").innerHTML = "";
        document.getElementById("play-page-ans-list").innerHTML = "";
    }

    renderFinish() {
        document.getElementById("play-page-header").innerHTML = "Соревнование завершено";
        document.getElementById("play-page-question").innerHTML = "Соревнование завершено";
        document.getElementById("play-page-ans-list").innerHTML = "";
    }

    addEventsOnButtons() {

    }
}