/**
 * Класс для запросов на сервер
 */
"use strict";

import globalBus from "../globalBus";

const messagesFromHost = {
    HTTP_OK : 2,
    XHR_READY : 4
};

const WITH_CREDENTIALS = true;

export default class Requester {

    constructor() {
        globalBus().requester = this;
    }

    /**
     * Возвращает url backend сервера
     * @returns {string}
     */
    static baseUrl() {
        return  "https://keklik-api.herokuapp.com/";
    }

    static getToken() {
        return localStorage.getItem("token") !== null ? localStorage.getItem("token") : "no";
    }

    static setToken(resp) {
        let token = "Token " + resp.token.toString();
        localStorage.setItem("token", token);
        console.log("TOKEN = " + localStorage.getItem("token"));
    }

    static setUser(resp) {
        localStorage.setItem("user", JSON.stringify(resp));
        console.log("USER = " + localStorage.getItem("user"));
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
        xhr.setRequestHeader("Authorization", Requester.getToken());

        if (method === "GET") {
            xhr.send(null);
        } else {
            xhr.send(body);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== messagesFromHost.XHR_READY) {
                return;
            }
            if (parseInt(+xhr.status/100) !== messagesFromHost.HTTP_OK) {
                return callback(xhr, null);
            }

            const response = JSON.parse(xhr.responseText);

            if (method !== 'GET') {
                // только при регистрации
                Requester.setToken(response);
                Requester.setUser(response);
            }

            callback(null, response);
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
}
