"use strict";

import FormValidator from "../../modules/FormValidator.js";
import globalBus from "../../modules/globalBus.js";
import Requester from "../../modules/network/Requester.js";
import fieldsCleaner from "./../../modules/fieldsCleaner.js";
import PagePresenter from "../../modules/PagePresenter";

const messagesLoginForm = {
    EMPTY_MESSAGE : "Заполнены не все поля",
    INCORRECT_MESSAGE : "Использованы недопустимые символы",
    RESPONSE_MESSAGE : "Некорректный ввод или логина не существует",
    SUCCESS_SIGN_IN_MESSAGE : "Вы вошли на сайт!"
};

export default class LoginForm extends FormValidator {

    constructor() {
        super();
        Object.assign(LoginForm.prototype, fieldsCleaner);
        this.loginValue = "";
        this.passwordValue = "";
        this.errorBox = null;
        this.addEventsToButtons();
        console.log("log FORM");
    }

    static msgEmptyField() {
        return messagesLoginForm.EMPTY_MESSAGE;
    }

    static msgIncorrectInput() {
        return messagesLoginForm.INCORRECT_MESSAGE;
    }

    static msgResponseFromHost() {
        return messagesLoginForm.RESPONSE_MESSAGE;
    }

    static msgSignUpSuccess() {
        return messagesLoginForm.SUCCESS_SIGN_IN_MESSAGE;
    }

    static validate(loginValue, passwordValue, errorBox) {
        let login = FormValidator.correctLogin(loginValue);
        let password = FormValidator.correctPassword(passwordValue);

        if (login === FormValidator.responseEmpty() || password === FormValidator.responseEmpty()) {
            errorBox.innerHTML = LoginForm.msgEmptyField();
            return false;
        }

        if (login === FormValidator.responseIncorrect() || password === FormValidator.responseIncorrect()) {
            errorBox.innerHTML = LoginForm.msgIncorrectInput();
            return false;
        }

        errorBox.innerHTML = "";
        return true;
    }

    clearForm() {
        this.clearFields(
            "login-form-login",
            "login-form-password",
            "login-form-err"
        );
    }

    sendRequest() {
        Requester.auth(this.loginValue, this.passwordValue, (err, resp) => {
            if (err) {
                return this.errorBox.innerHTML = LoginForm.msgResponseFromHost();
            }
            globalBus().authWorker.autharization(resp);
            // alert(LoginForm.msgSignUpSuccess());
            this.clearForm();
            globalBus().officePage.render();
            // PagePresenter.showOnlyOnePage("office-page");
            globalBus().btn.officeBtn.click();
        });
    }

    addEventsToButtons() {

        document.querySelector("#login-form-btn").addEventListener("click", () => {
            this.loginValue = document.querySelector("#login-form-login").value;
            this.passwordValue = document.querySelector("#login-form-password").value;
            this.errorBox = document.querySelector("#login-form-err");

            console.log("log BTN");
            const valid = LoginForm.validate(this.loginValue, this.passwordValue, this.errorBox);

            if (valid) {
                this.sendRequest();
            }
        });
    }
}
