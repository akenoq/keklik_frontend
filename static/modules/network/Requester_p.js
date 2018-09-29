"use strict";

import globalBus from "./../globalBus.js";

const msgFromHost = {
    HTTP_OK: 200,
    HTTP_CREATED: 201
};

export default class Requester {
    constructor() {
        this.basicUrl = "http://keklik-api.herokuapp.com/api";
        globalBus().requester = this;
    }

    httpRequest(url, type='GET', data='') {
        let fullUrl = this.basicUrl + url;
        let body = data;
        return new Promise(function (resolve, reject) {

            let xhr = new XMLHttpRequest();
            xhr.open(type, fullUrl, true);

            if (type !== 'GET') {
                xhr.withCredentials = true; //for cookies
                body = JSON.stringify(data);
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf8");
                xhr.send(body);
            } else {
                xhr.send();
            }

            xhr.onload = function () {
                if (this.status === msgFromHost.HTTP_OK ||
                    this.status === msgFromHost.HTTP_CREATED) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    let error = new Error(this.statusText);
                    error.code = this.status;
                    reject(error);
                }
            };

            xhr.onerror = function () {
                reject(new Error("Network Error"));
            };

            xhr.send();
        });
    }

    /**
     * Регистрация пользователя
     * @param login
     * @param password
     */
    register(login, password) {
        const user = {login, password};
        this.httpRequest("/users", user)
            .then(
                response => {
                    return response
                }
            )
            .catch (
                error => {
                    alert(`Rejected: ${error}`)
                }
            )
    }
}