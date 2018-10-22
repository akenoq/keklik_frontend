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
            document.getElementById("game-table-question").innerHTML = "";
        };
    }

    renderQuestion(ws_dataObj) {
        document.getElementById("question-preview").innerHTML = ws_dataObj
            .payload
            .data
            .current_question
            .question;
    }

    renderQuizNum(game_id) {
        document.getElementById("game-num").innerHTML = `Ход викторины ${game_id}`;
        document.getElementById("next-question-btn").disabled = false;
    }

    renderGameTable(ws_gameObj) {
        let data = ws_gameObj.payload.data;
        console.log("DATA = " + data);
        let ansUser = data.player.user.username;
        if (data.player.user.last_name !== "") {
            ansUser = data.player.user.last_name;
        }
        console.log("ОТВЕТИЛ " + ansUser);
        if (data.correct === true) {
            document.getElementById("game-table-question").innerHTML +=
                `<tr class="table-group-line right-ans">
                    <th scope="row">1</th>
                    <td>${ansUser}</td>
                    <td>${data.answer[0].variant}</td>
            </tr>`
        } else {
            document.getElementById("game-table-question").innerHTML +=
                `<tr class="table-group-line">
                    <th scope="row">1</th>
                    <td>${ansUser}</td>
                    <td>${data.answer[0].variant}</td>
            </tr>`
        }
    }

    renderFinish(ws_dataObj) {
        document.getElementById("question-preview").innerHTML = "Викторина завершена";
        document.getElementById("next-question-btn").disabled = true;
        // печать результатов
    }
}