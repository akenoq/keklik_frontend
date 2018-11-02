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

    start(quiz_id, game_title, group_id) {
        document.getElementById("focus-btn").focus();
        // запрос на создание игры /games/
        console.log("Переход на страницу с игрой " + quiz_id);
        Requester.createGame(quiz_id, game_title, group_id, (err, resp) => {
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

    restart_manage(game_id) {
        document.getElementById("focus-btn").focus();
        Requester.getGameById(game_id, (err, resp) => {
           if (err) {
               debugLog("err in get game by id")
           } else {
               this.game_id = game_id;
               let ws_dataObj = {
                   payload: {}
               };
               ws_dataObj.payload.data = resp;
               debugLog("my DATA OBJ");
               debugLog(ws_dataObj);

               if (resp.state === "players_waiting") {
                   globalBus().gameTeacherPage.renderQuizNum(game_id);
               } else if (resp.state === "answering") {
                   globalBus().gameTeacherPage.renderQuizNum(game_id);
                   globalBus().gameTeacherPage.prepareGameMode();
                   globalBus().gameTeacherPage.renderQuestion(ws_dataObj);
               }

               debugLog("GAME ID = " + this.game_id);
               this.ws_controller = new WsController("teacher");
               debugLog("WS");
           }
        });
    }

    join(game_id) {
        document.getElementById("focus-btn").focus();
        this.game_id = game_id;
        this.ws_controller = new WsController("student");
        globalBus().gameStudentPage.renderWaitingStart();
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
        globalBus().prev_game = this.game_id;
        this.ws_controller.disconnect();
        this.ws_controller = null;
        this.game_id = null;
        this.joined_counter = 0;
        this.answered_counter = 0;
        this.game_started = false;
    }

    stop() {

    }
}