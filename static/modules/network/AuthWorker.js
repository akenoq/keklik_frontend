/**
 * Класс для работы с авторизацией
 */
"use strict";


export default class AuthWorker {

    /**
     * Возвращает токен
     * @returns {string}
     */
    getToken() {
        return localStorage.getItem("token") !== null ? localStorage.getItem("token") : "no";
    }

    /**
     * Сохраняет токен
     * @param resp
     */
    static setToken(resp) {
        let token = "Token " + resp.token.toString();
        localStorage.setItem("token", token);
        console.log("TOKEN = " + localStorage.getItem("token"));
    }

    /**
     * Сохраняет данные текущего пользователя
     * @param resp
     */
    static setUser(resp) {
        localStorage.setItem("user", JSON.stringify(resp));
        console.log("USER = " + localStorage.getItem("user"));
    }

    autharization(resp) {
        AuthWorker.setToken(resp);
        AuthWorker.setUser(resp);
    }
}
