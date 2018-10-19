"use strict";

import globalBus from "./globalBus";

export default class GameManager {
    constructor() {
        globalBus().gameManager = this;
        console.log("GAME MANAGER START");
    }

    start(game_id) {
        // запрос на создание игры /games/
        console.log("Переход на страницу с игрой " + game_id);
    }

    stop() {

    }
}