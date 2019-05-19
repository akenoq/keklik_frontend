/**
 * Класс для запросов на сервер
 */
"use strict";

import globalBus from "../globalBus";
import debugLog from "../debugLog";

const messagesFromHost = {
    HTTP_OK : 2,
    XHR_READY : 4
};

const WITH_CREDENTIALS = false;

export default class Requester {

    /**
     * Возвращает url backend сервера
     * @returns {string}
     */
    static baseUrl() {
        // return  "https://keklik-api.herokuapp.com/";
        // return "http://46.229.213.75:8000/";
        return "http://api.keklik.xyz/"
    }

    /**
     * HTTP-запрос на сервер
     * @param {string} method - метод запроса "GET", "POST"
     * @param {string} address
     * @param {object} data
     * @param callback
     */
    static requestToHost(method = "GET", address, data = null, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, this.baseUrl() + address, true);
        xhr.withCredentials = WITH_CREDENTIALS; //for cookies

        const body = JSON.stringify(data);

        xhr.setRequestHeader("Content-Type", "application/json; charset=utf8");
        xhr.setRequestHeader("Authorization", globalBus().authWorker.getToken());

        if (method === "GET" || method === "DELETE") {
            xhr.send(null);
        } else {
            xhr.send(body);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== messagesFromHost.XHR_READY) {
                return;
            }
            if (parseInt(+xhr.status/100) !== messagesFromHost.HTTP_OK) {
                if (JSON.parse(xhr.responseText).message === "Invalid token.") {
                    globalBus().authWorker.deleteToken();
                }
                debugLog(xhr.status + ' from 400');
                callback(xhr, null);
                // $(document).ready(function(){
                //     $('[data-toggle="tooltip"]').tooltip();
                // });
                return;
            }

            if (method !== "DELETE") {
                const response = JSON.parse(xhr.responseText);
                callback(null, response);
                // $(document).ready(function(){
                //     $('[data-toggle="tooltip"]').tooltip();
                // });
            } else {
                callback(null, null);
                // $(document).ready(function(){
                //     $('[data-toggle="tooltip"]').tooltip();
                // });
            }
        };
    }

    /**
     * Авторизация пользователя
     * @param username
     * @param password
     * @param callback
     */
    static auth(username, password, callback) {
        const user = {username, password};
        Requester.requestToHost("POST", "api/session/", user, callback);
    }

    /**
     * Регистрация пользователя
     * @param username
     * @param password
     * @param callback
     */
    static register(username, password, callback) {
        const user = {username, password};
        Requester.requestToHost("POST", "api/users/", user, callback);
    }

    /**
     * Узнает информацию о текущем пользователе
     * @param callback
     */
    static whoami(callback) {
        Requester.requestToHost("GET", "api/users/me/", null, callback);
    }

    static quizNew(quiz, callback) {
        Requester.requestToHost("POST", "api/quizzes/", quiz, callback);
    }

    static quizEdit(id, quiz, callback) {
        debugLog("id = " + id);
        Requester.requestToHost("PUT", `api/quizzes/${id}/`, quiz, callback);
    }

    static quizzesAll(callback) {
        Requester.requestToHost("GET", "api/quizzes/", null, callback);
    }

    static quizzesOfUser(callback) {
        Requester.requestToHost("GET", "api/users/me/quizzes/", null, callback);
    }

    static changeUserData(last_name, email, callback) {
        const userData = {last_name, email};
        Requester.requestToHost("PATCH", "api/users/me/", userData, callback);
    }

    static changePassword(old_password, new_password, callback) {
        const data = {old_password, new_password};
        Requester.requestToHost("POST", "api/users/me/password/", data, callback);
    }

    static getQuizById(id, callback) {
        Requester.requestToHost("GET", `api/quizzes/${id}/`, null, callback);
    }

    static createGame(id, label = "", group_id, callback) {
        let quiz = null;
        if (group_id === null) {
            quiz = {
                quiz: id,
                label: label,
                online: true
            };
        } else {
            quiz = {
                quiz: id,
                label: label,
                online: true,
                group: group_id
            };
        }
        Requester.requestToHost("POST", "api/games/", quiz, callback);
    }

    static organizationsAll(callback) {
        Requester.requestToHost("GET", "api/organizations/", null, callback);
    }

    static getOrganizationsById(id, callback) {
        Requester.requestToHost("GET", `api/organizations/${id}/`, null, callback);
    }

    static getRunningGameByGroupId(id, callback) {
        Requester.requestToHost("GET", `api/groups/${id}/games/running/`, null, callback);
    }

    static getRunningGameByUser(callback) {
        Requester.requestToHost("GET", "api/games/my/running/", null, callback);
    }

    static getGameById(id, callback) {
        Requester.requestToHost("GET", `api/games/${id}`, null, callback);
    }

    static getGameRatingById(id, callback) {
        Requester.requestToHost("GET", `api/games/${id}/rating/`, null, callback);
    }

    static getGameByUser(url_to_page, callback) {
        let url = "api/" + url_to_page.split("/api/")[1];
        // https://api.example.org/accounts/?limit=100&offset=400
        Requester.requestToHost("GET", url, null, callback);
    }

    static delGameById(id, callback) {
        Requester.requestToHost("DELETE", `api/games/${id}/`, null, callback)
    }

    static getNumberGames(callback) {
        Requester.requestToHost("GET", "api/stats/", null, callback)
    }
}
