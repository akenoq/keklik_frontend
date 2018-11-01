"use strict";

import Page from "./Page.js";
import PagePresenter from "../modules/PagePresenter";
import globalBus from "../modules/globalBus";
import authWorker from "../modules/network/AuthWorker";
import htmlEntities from "../modules/htmlEntities";

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
            {button: "join-game-btn_clicker", nextPage: "play-page", pagePath: "/play"},
            {button: "exit-game-student-btn", nextPage: "office-page", pagePath: "/office"}
        );
        console.log("add redirect");
    }

    renderQuestion(ws_dataObj) {
        document.getElementById("play-page-header").innerHTML =
            "Соревнование " +
            ws_dataObj.payload.data.id + ": " +
            ws_dataObj.payload.data.quiz.title;
        document.getElementById("play-page-question").innerHTML =
            "Вопрос "+
            ws_dataObj.payload.data.current_question.number + "/<b>" +
            ws_dataObj.payload.data.quiz.questions.length + "</b>" + ": " +
            htmlEntities(ws_dataObj.payload.data.current_question.question);
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
                htmlEntities(ws_dataObj.payload.data.current_question.variants[i].variant);
            document.getElementById(`ans-btn-${variant_id}`).onclick = () => {
                console.log("______________click______________");
                globalBus().gameManager.sendAnswer(variant_id, cur_question_id);
            }
        }
    }

    renderWaitingStart() {
        document.getElementById("exit-game-student-btn").hidden = true;
        document.getElementById("play-page-header").innerHTML = `Ожидание старта соревнования
        ${globalBus().gameManager.game_id}...`;
        document.getElementById("play-page-question").innerHTML = "";
        document.getElementById("play-page-ans-list").innerHTML = "";
        document.getElementById("play-figure").setAttribute("src", "img/pic.jpg");
    }

    renderWaitingNext() {
        document.getElementById("play-page-header").innerHTML = "Следующий вопрос...";
        document.getElementById("play-page-question").innerHTML = "";
        document.getElementById("play-page-ans-list").innerHTML = "";
    }

    renderFinish(ws_dataObj) {
        document.getElementById("exit-game-student-btn").hidden = false;
        let data = ws_dataObj.payload.data;
        let max_score = 0;
        let person_score = 0;
        let len_quiz = data.generated_questions.length;
        for (let i = 0; i < len_quiz; i++) {
            let gen_question = data.generated_questions[i];
            max_score += gen_question.points;
            let len_players_ans = gen_question.players_answers.length;
            for (let k = 0; k < len_players_ans; k++) {
                if (gen_question.players_answers[k].player.user.username === authWorker.getUsername() &&
                    gen_question.players_answers[k].correct === true) {
                    console.log("USER NAME = " + authWorker.getUsername());
                    person_score += gen_question.points;
                }
            }
        }

        document.getElementById("play-page-header").innerHTML = "Соревнование завершено";
        document.getElementById("play-page-question").innerHTML = "Ваш результат " + person_score + " из " + max_score;
        document.getElementById("play-page-ans-list").innerHTML = "";
        document.getElementById("play-figure").setAttribute("src", "img/finish_flag_700.jpg");
    }

    addEventsOnButtons() {

    }
}