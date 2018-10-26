"use strict";

import globalBus from "../globalBus";
import AuthWorker from "./AuthWorker";
import debugLog from "./../debugLog";

const WS_URL = "ws://api.keklik.xyz/?session_key=";
const TEACHER_ROLE = "teacher";
const STUDENT_ROLE = "student";

const ACTIONS = {
    "subscribe" : "subscribe",
    "join" : "join",
    "next_question" : "next_question",
    "answer" : "answer",
    "finish" : "finish"
};

const STATE = {
    "answering" : "answering",
    "finish" : "finish"
};
export default class WsController {
    // передавать вид события
    constructor(role="unknown") {
        this.role = role;
        this.socket = null;
        this.create();
        this.addEvents();
    }

    create() {
        this.socket = new WebSocket(`${WS_URL}${AuthWorker.getSessionKey()}`);
    }

    addEvents() {
        this.socket.onopen = () => {
            debugLog("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            debugLog("Соединение установлено");
            debugLog("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            if (this.role === TEACHER_ROLE) {
                this.subscribeTeacher(globalBus().gameManager.game_id);
            } else if (this.role === STUDENT_ROLE) {
                this.joinStudent(globalBus().gameManager.game_id);
                this.subscribeStudent(globalBus().gameManager.game_id);
            }
        };

        this.socket.onclose = (event) => {
            debugLog("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            debugLog("Соединение закрыто");
            debugLog("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            // reload
        };

        this.socket.onmessage = (event) => {
            debugLog("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            debugLog("Получено сообщение: " + event.data);
            debugLog("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            const ws_dataObj = JSON.parse(event.data);
            if (this.role === TEACHER_ROLE) {
                // рендерить только экшн next question и потом экшн answer
                if (ws_dataObj.payload.action === ACTIONS.next_question &&
                    ws_dataObj.payload.data.state !== STATE.finish) {
                    debugLog(ws_dataObj.payload.data.current_question + "_TEACHER_____________________________");
                    globalBus().gameTeacherPage.renderQuestion(ws_dataObj);
                } else if (ws_dataObj.payload.data.state === STATE.finish) {
                    debugLog("_________________FINISH___________________");
                    globalBus().gameTeacherPage.renderFinish(ws_dataObj);
                    globalBus().gameManager.reset();
                } else if (ws_dataObj.payload.action === ACTIONS.answer) {
                    globalBus().gameTeacherPage.renderGameTable(ws_dataObj);
                } else if (ws_dataObj.payload.action === ACTIONS.join) {
                    globalBus().gameManager.joined_counter += 1;
                    debugLog("JOINED________________" + globalBus().gameManager.joined_counter);
                    globalBus().gameTeacherPage.renderAnsweredCounter();
                    globalBus().gameTeacherPage.renderJoinedCounter();
                }
            } else if (this.role === STUDENT_ROLE) {
                if (ws_dataObj.payload.action === ACTIONS.next_question &&
                ws_dataObj.payload.data.state !== STATE.finish) {
                    debugLog(ws_dataObj.payload.data.current_question + "_STUDENT_____________________________");
                    globalBus().gameStudentPage.renderQuestion(ws_dataObj);
                } else if (ws_dataObj.payload.action === ACTIONS.finish) {
                    debugLog("_________________FINISH___________________");
                    globalBus().gameStudentPage.renderFinish(ws_dataObj);
                    globalBus().gameManager.reset();
                }
            }
        };

        this.socket.onerror = (error) => {
            debugLog("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            debugLog("Ошибка: " + error.message);
            debugLog("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
            // reload
        };
    }

    joinStudent(game_id) {
        debugLog("SEND JOIN STUDENT");
        this.socket.send(JSON.stringify(
            {
                "stream": "games",
                "payload": {
                    "action": "join",
                    "pk": game_id
                }
            }));
    }

    subscribeTeacher(game_id) {
        debugLog("SEND SUBSCRIBE TEACHER");
        this.socket.send(JSON.stringify(
            {
                "stream": "games",
                "payload": {
                    "action": "subscribe",
                    "pk": game_id,
                "data": {
                    "action": "join"
                    }
                }
            }));
        this.socket.send(JSON.stringify(
            {
                "stream": "games",
                "payload": {
                "action": "subscribe",
                    "pk": game_id,
                "data": {
                    "action": "answer"
                    }
                }
            }));
    }

    subscribeStudent(game_id) {
        debugLog("Subscribe STUDENT");
        this.socket.send(JSON.stringify(
            {
                "stream": "games",
                "payload": {
                    "action": "subscribe",
                    "pk": game_id,
                    "data": {
                        "action": "next_question"
                    }
                }
            }));
        this.socket.send(JSON.stringify(
            {
                "stream": "games",
                "payload": {
                    "action": "subscribe",
                    "pk": game_id,
                    "data": {
                        "action": "finish"
                    }
                }
            }));
    }

    sendNextMessage(game_id) {
        debugLog("GAME ID in sending = " + game_id);
        this.socket.send(
            JSON.stringify({
            "stream": "games",
            "payload": {
                "action": "next_question",
                "pk": game_id
            }
        }));
    }

    sendAnswerMessage(game_id, ans_var_index, cur_question_id) {
        debugLog("GAME ID in ANSWERING = " + game_id);
        this.socket.send(
            JSON.stringify({
                "stream": "games",
                "payload": {
                    "action": "answer",
                    "data": {
                        "answer": [ans_var_index],
                        "question": cur_question_id
                    },
                    "pk": game_id
                }
            }));
    }

    disconnect() {
        this.socket.close();
    }
}
