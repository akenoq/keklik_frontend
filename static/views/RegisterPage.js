"use strict";

import Page from "./Page.js";
import RegisterForm from "../modules/RegisterForm.js";

export default class RegisterPage extends Page {

    constructor() {
        super();
        this.form = new RegisterForm();
    }

    static pagePath() {
        return "/register";
    }

    static pageBoxName() {
        return "register-page";
    }

    getForm() {
        return this.form;
    }

    addEventsOnButtons() {

    }
}