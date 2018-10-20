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
        this.ws_controller.sendNextMessage(this.game_id);
    }

    stop() {

    }
}