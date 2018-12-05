"use strict";

import globalBus from "./globalBus";
import Requester from "./network/Requester";
import WsController from "./network/WsController";
import debugLog from "./debugLog";

export default class GameManager {
    constructor() {
        globalBus().gameManager = this;
        debugLog("GAME MANAGER START");
        this.ws_controller = null;
        this.game_id = null;
        this.joined_counter = 0;
        this.answered_counter = 0;
        this.game_started = false;
    }

    start(quiz_id, game_title, group_id) {
        document.getElementById("focus-btn").focus();
        // запрос на создание игры /games/
        debugLog("Переход на страницу с игрой " + quiz_id);
        Requester.createGame(quiz_id, game_title, group_id, (err, resp) => {
            if (err) {
                debugLog(err);
                return;
            }
            this.game_id = resp.id;
            globalBus().gameTeacherPage.renderQuizNum(this.game_id);
            debugLog("GAME ID = " + this.game_id);
            this.ws_controller = new WsController("teacher");
            debugLog("WS");
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
               this.joined_counter = resp.players.length;

               debugLog("my DATA OBJ");
               debugLog(ws_dataObj);

               if (resp.state === "players_waiting") {
                   this.answered_counter = 0;
                   globalBus().gameTeacherPage.renderQuizNum(game_id);
                   globalBus().gameTeacherPage.renderJoinedCounter();
               } else if (resp.state === "answering") {
                   this.answered_counter = resp.current_question.players_answers.length;
                   globalBus().gameTeacherPage.renderQuizNum(game_id);
                   globalBus().gameTeacherPage.prepareGameMode();
                   globalBus().gameTeacherPage.renderAnsweredCounter();
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

    showTrueAnswer() {
        debugLog("true ans send");
        this.ws_controller.sendTrueAnsForAll(this.game_id);
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