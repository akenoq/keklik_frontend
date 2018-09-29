/**
 * Класс для запросов на сервер
 */
"use strict";

import globalBus from "../globalBus";

const messagesFromHost = {
    HTTP_OK : 200,
    XHR_READY : 4
};

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

    /**
     * POST-запрос на сервер
     * @param {string} address
     * @param {object} data
     * @param callback
     */
    static requestPost(address, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", this.baseUrl() + address, true);
        xhr.withCredentials = true; //for cookies

        const body = JSON.stringify(data);

        xhr.setRequestHeader("Content-Type", "application/json; charset=utf8");

        xhr.send(body);

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== messagesFromHost.XHR_READY) {
                return;
            }
            if (+xhr.status !== messagesFromHost.HTTP_OK) {
                return callback(xhr, null);
            }

            const response = JSON.parse(xhr.responseText);
            callback(null, response);
        };
    }

    /**
     * GET-запрос на сервер
     * @param {string} address - string with url
     * @param callback
     */
    static requestGet(address, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", this.baseUrl() + address, true);
        xhr.withCredentials = true;

        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== messagesFromHost.XHR_READY) {
                return;
            }
            if (+xhr.status !== messagesFromHost.HTTP_OK) {
                return callback(xhr, null);
            }

            const response = JSON.parse(xhr.responseText);
            callback(null, response);
        };
    }

    /**
     * PATCH-запрос на сервер
     * @param {string} address
     * @param {object} data
     * @param callback
     */
    static requestPatch(address, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open("PATCH", this.baseUrl() + address, true);
        xhr.withCredentials = true; //for cookies

        const body = JSON.stringify(data);

        xhr.setRequestHeader("Content-Type", "application/json; charset=utf8");

        xhr.send(body);

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== messagesFromHost.XHR_READY) {
                return;
            }
            if (+xhr.status !== messagesFromHost.HTTP_OK) {
                return callback(xhr, null);
            }

            const response = JSON.parse(xhr.responseText);
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
        Requester.requestPost("api/users/signin/", user, callback);
    }

    /**
     * Регистрация пользователя
     * @param username
     * @param password
     * @param callback
     */
    static register(username, password, callback) {
        const user = {username, password};
        Requester.requestPost("api/users/", user, callback);
    }

    /**
     * Узнает информацию о текущем пользователе
     * @param callback
     */
    static whoami(callback) {
        Requester.requestGet("api/users/me/", callback);
    }
}
