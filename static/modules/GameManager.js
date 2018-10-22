"use strict";

import globalBus from "./globalBus";
import Requester from "./network/Requester";
import WsController from "./network/WsController";
import debugLog from "./debugLog";

export default class GameManager {
    constructor() {
        globalBus().gameManager = this;
        console.log("GAME MANAGER START");
        this.ws_controller = null;
        this.game_id = null;
        this.joined_counter = 0;
        this.answered_counter = 0;
        this.game_started = false;
    }

    start(quiz_id, game_title) {
        document.getElementById("focus-btn").focus();
        // запрос на создание игры /games/
        console.log("Переход на страницу с игрой " + quiz_id);
        Requester.createGame(quiz_id, game_title, (err, resp) => {
            if (err) {
                console.log(err);
                return;
            }
            this.game_id = resp.id;
            globalBus().gameTeacherPage.renderQuizNum(this.game_id);
            console.log("GAME ID = " + this.game_id);
            this.ws_controller = new WsController("teacher");
            console.log("WS");
        });
    }

    join(game_id) {
        document.getElementById("focus-btn").focus();
        this.game_id = game_id;
        this.ws_controller = new WsController("student");
    }


    switchNext(){
        if (this.game_started === false) {
            globalBus().gameTeacherPage.prepareGameMode();
            this.game_started = true;
        }
        this.answered_counter = 0;
        globalBus().gameTeacherPage.renderAnsweredCounter();
        this.ws_controller.sendNextMessage(this.game_id);
    }

    sendAnswer(var_index, cur_question_id) {
        this.ws_controller.sendAnswerMessage(this.game_id, var_index, cur_question_id);
        globalBus().gameStudentPage.renderWaitingNext();
    }

    reset() {
        this.ws_controller = null;
        this.game_id = null;
        this.joined_counter = 0;
        this.answered_counter = 0;
        this.game_started = false;
    }

    stop() {

    }
}