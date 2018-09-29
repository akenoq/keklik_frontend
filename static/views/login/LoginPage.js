"use strict";

import Page from "../Page.js";
import LoginForm from "./LoginForm.js";

export default class RegisterPage extends Page {

    constructor() {
        super();
        this.form = new LoginForm();
    }

    static pagePath() {
        return "/login";
    }

    static pageBoxName() {
        return "login-page";
    }

    getForm() {
        return this.form;
    }

    addEventsOnButtons() {

    }
}