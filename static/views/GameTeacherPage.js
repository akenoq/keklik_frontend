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
        this.prepareWaitingPlayers();
        console.log("add redirect");
    }

    addEventsOnButtons() {
        document.getElementById("next-question-btn").onclick = () => {
            globalBus().gameManager.switchNext();
            document.getElementById("game-table-question").innerHTML = "";
        };
    }

    prepareWaitingPlayers() {
        document.getElementById("next-question-btn").innerHTML = "Запустить соревнование >>";
        document.getElementById("answered-counter").hidden = true;
        document.getElementById("joined-counter").hidden = false;
        document.getElementById("game-table").hidden = true;
        this.renderJoinedCounter();
        this.renderAnsweredCounter();
    }

    prepareGameMode() {
        document.getElementById("next-question-btn").innerHTML = "Следующий вопрос >>";
        document.getElementById("joined-counter").hidden = true;
        document.getElementById("answered-counter").hidden = false;
        document.getElementById("game-table").hidden = false;
    }

    renderQuestion(ws_dataObj) {
        document.getElementById("question-preview").innerHTML =
            "Вопрос "+
            ws_dataObj.payload.data.current_question.number + "/<b>" +
            ws_dataObj.payload.data.quiz.questions.length + "</b>" + ": " +
            ws_dataObj.payload.data.current_question.question;
    }

    renderQuizNum(game_id) {
        document.getElementById("game-num").innerHTML = `Ход соревнования ${game_id}`;
        document.getElementById("next-question-btn").disabled = false;
    }

    renderAnsweredCounter() {
        document.getElementById("answered-counter").querySelector("ans").innerHTML =
            globalBus().gameManager.answered_counter.toString();
        document.getElementById("answered-counter").querySelector("all").innerHTML =
            globalBus().gameManager.joined_counter.toString();
    }

    renderJoinedCounter() {
        document.getElementById("joined-counter").querySelector("all").innerHTML =
            globalBus().gameManager.joined_counter.toString();
    }

    renderGameTable(ws_gameObj) {
        // индикатор сколько ответило
        globalBus().gameManager.answered_counter += 1;
        this.renderAnsweredCounter();

        let data = ws_gameObj.payload.data;
        console.log("DATA = " + data);
        let ansUser = data.player.user.username;
        if (data.player.user.last_name !== "") {
            ansUser = data.player.user.last_name;
        }
        console.log("ОТВЕТИЛ " + ansUser);
        if (data.correct === true) {
            document.getElementById("game-table-question").innerHTML +=
                `<tr class="line-result-table table-group-line right-ans">
                    <th scope="row">${globalBus().gameManager.answered_counter}</th>
                    <td>${ansUser}</td>
                    <td>${data.answer[0].variant}</td>
            </tr>`
        } else {
            document.getElementById("game-table-question").innerHTML +=
                `<tr class="line-result-table table-group-line">
                    <th scope="row">${globalBus().gameManager.answered_counter}</th>
                    <td>${ansUser}</td>
                    <td>${data.answer[0].variant}</td>
            </tr>`
        }
    }

    renderFinish(ws_dataObj) {
        document.getElementById("question-preview").innerHTML = "Викторина завершена";
        document.getElementById("next-question-btn").disabled = true;
        document.getElementById("answered-counter").hidden = true;
        document.getElementById("joined-counter").hidden = true;
        document.getElementById("game-table").hidden = true;
        // печать результатов
    }
}