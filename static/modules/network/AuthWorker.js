/**
 * Класс для работы с авторизацией
 */
"use strict";


export default class AuthWorker {

    /**
     * Возвращает token
     * @returns {string}
     */
    getToken() {
        return localStorage.getItem("token") !== null ? localStorage.getItem("token") : "no";
    }

    /**
     * Возвращает session_key
     * @returns {string}
     */
    static getSessionKey() {
        return localStorage.getItem("session_key") !== null ? localStorage.getItem("session_key") : "no";
    }

    /**
     * Возвращает username
     * @returns {string}
     */
    static getUsername() {
        return localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")).username : "no";
    }

    /**
     * Сохраняет token
     * @param resp
     */
    static setToken(resp) {
        let token = "Token " + resp.token.toString();
        localStorage.setItem("token", token);
        console.log("TOKEN = " + localStorage.getItem("token"));
    }

    /**
     * Сохраняет session_key
     * @param resp
     */
    static setSessionKey(resp) {
        let session_key = resp.session_key.toString();
        localStorage.setItem("session_key", session_key);
        console.log("session_key = " + localStorage.getItem("session_key"));
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
        AuthWorker.setSessionKey(resp);
        AuthWorker.setUser(resp);
    }

    deleteToken() {
        localStorage.removeItem("token");
        localStorage.removeItem("session_key");
        localStorage.removeItem("user");
    }
}
