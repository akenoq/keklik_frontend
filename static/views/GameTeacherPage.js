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
            {button: "start-game-btn", nextPage: "play-page-manage", pagePath: "/teacher"},
            {button: "exit-game-btn", nextPage: "office-page", pagePath: "/office"}
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
        document.getElementById("game-diagram").hidden = true;
        document.getElementById("exit-game-btn").hidden = true;

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
        document.getElementById("next-question-btn").hidden = false;
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

    countAllAnswers(ws_dataObj){
        let answers_count = {};
        answers_count.all = 0;
        answers_count.right = 0;
        answers_count.all_points = 0;
        answers_count.right_points = 0;

        let data = ws_dataObj.payload.data;
        let len_quiz = data.generated_questions.length;
        for (let i = 0; i < len_quiz; i++) {
            let gen_question = data.generated_questions[i];
            let len_players_ans = gen_question.players_answers.length;
            answers_count.all += len_players_ans;
            for (let k = 0; k < len_players_ans; k++) {
                answers_count.all_points += gen_question.points; // с каждым ответившим увеличиваем правильные очки
                if (gen_question.players_answers[k].correct === true) {
                    answers_count.right += 1;
                    answers_count.right_points += gen_question.points;
                }
            }
        }
        console.log(answers_count);
        return answers_count;
    }

    renderFinish(ws_dataObj) {
        // считаем соотношение ответов
        let all_ans_countObj = this.countAllAnswers(ws_dataObj);
        let all_ans_len = 0;
        let right_ans_len = 0;
        all_ans_len = all_ans_countObj.all;
        right_ans_len = all_ans_countObj.right;

        function okruglen_to_2(n) {
            return parseFloat(n.toFixed(2));
        }

        let right_proc = 0;
        right_proc = okruglen_to_2((right_ans_len/all_ans_len) * 100);
        let fail_proc = 0;
        fail_proc = 100 - right_proc;

        document.getElementById("game-diagram").hidden = false;
        document.getElementById("exit-game-btn").hidden = false;
        let chart = new CanvasJS.Chart("game-diagram", {
            theme: "light1",
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Общий итог"
            },
            data: [{
                type: "pie",
                startAngle: 25,
                toolTipContent: "<b>{label}</b>: {y}%",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - {y}%",
                dataPoints: [
                    { y: right_proc, label: "Правильных ответов" },
                    { y: fail_proc, label: "Неправильных ответов" },
                ]
            }]
        });
        chart.render();
        document.getElementById("question-preview").innerHTML = "Соревнование завершено";
        document.getElementById("next-question-btn").hidden = true;
        document.getElementById("answered-counter").hidden = true;
        document.getElementById("joined-counter").hidden = true;
        document.getElementById("game-table").hidden = true;
    }
}