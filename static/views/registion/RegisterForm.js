"use strict";

import FormValidator from "../../modules/FormValidator.js";
import globalBus from "../../modules/globalBus.js";
import Requester from "../../modules/network/Requester.js";
import fieldsCleaner from "./../../modules/fieldsCleaner.js";
import PagePresenter from "../../modules/PagePresenter";

const messagesRegisterForm = {
    EMPTY_MESSAGE : "Заполнены не все поля",
    INCORRECT_MESSAGE : "Использованы недопустимые символы",
    RESPONSE_MESSAGE : "Некорректный ввод или логин уже существует",
    SUCCESS_SIGN_UP_MESSAGE : "Вы успешо зарегистрировались!"
};

export default class RegisterForm extends FormValidator {

    constructor() {
        super();
        Object.assign(RegisterForm.prototype, fieldsCleaner);
        this.loginValue = "";
        this.passwordValue = "";
        this.errorBox = null;
        this.addEventsToButtons();
        console.log("reg FORM");
    }

    static msgEmptyField() {
        return messagesRegisterForm.EMPTY_MESSAGE;
    }

    static msgIncorrectInput() {
        return messagesRegisterForm.INCORRECT_MESSAGE;
    }

    static msgResponseFromHost() {
        return messagesRegisterForm.RESPONSE_MESSAGE;
    }

    static msgSignUpSuccess() {
        return messagesRegisterForm.SUCCESS_SIGN_UP_MESSAGE;
    }

    static validate(loginValue, passwordValue, errorBox) {
        let login = FormValidator.correctLogin(loginValue);
        let password = FormValidator.correctPassword(passwordValue);

        if (login === FormValidator.responseEmpty() || password === FormValidator.responseEmpty()) {
            errorBox.innerHTML = RegisterForm.msgEmptyField();
            return false;
        }

        if (login === FormValidator.responseIncorrect() || password === FormValidator.responseIncorrect()) {
            errorBox.innerHTML = RegisterForm.msgIncorrectInput();
            return false;
        }

        errorBox.innerHTML = "";
        return true;
    }

    clearForm() {
        this.clearFields(
            "regform-login",
            "regform-password",
            "regform-err"
        );
    }

    sendRequest() {
        Requester.register(this.loginValue, this.passwordValue, (err, resp) => {
            if (err) {
                return this.errorBox.innerHTML = RegisterForm.msgResponseFromHost();
            }
            globalBus().authWorker.autharization(resp);
            alert(RegisterForm.msgSignUpSuccess());
            this.clearForm();
            globalBus().officePage.render();
            PagePresenter.showOnlyOnePage("office-page");
        });
    }

    addEventsToButtons() {

        document.querySelector("#regformBtn").addEventListener("click", () => {
            this.loginValue = document.querySelector("#regform-login").value;
            this.passwordValue = document.querySelector("#regform-password").value;
            this.errorBox = document.querySelector("#regform-err");

            const valid = RegisterForm.validate(this.loginValue, this.passwordValue, this.errorBox);

            if (valid) {
                this.sendRequest();
            }
        });

        // document.querySelector(".register-page__button-back").addEventListener("click", () => {this.clearForm();});
        // document.querySelector(".register-page__link-to-login").addEventListener("click", () => {this.clearForm();});
    }
}
