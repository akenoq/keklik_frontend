"use strict";

import FormValidator from "../../modules/FormValidator.js";
import Requester from "../../modules/network/Requester.js";
import fieldsCleaner from "./../../modules/fieldsCleaner.js";
import debugLog from "../../modules/debugLog";

const messagesProfileForm = {
    INCORRECT_MESSAGE : "Использованы недопустимые символы",
    SUCCESS_MESSAGE : "Данные изменены!"
};

export default class ProfileForm extends FormValidator {

    constructor() {
        super();
        Object.assign(ProfileForm.prototype, fieldsCleaner);
        this.nameValue = document.querySelector("#profile-name").value;
        this.emailValue = document.querySelector("#profile-email").value;
        this.passwordValue = document.querySelector("#profile-old-password").value;
        this.newPasswordValue = document.querySelector("#profile-new-password").value;
        this.newPasswordValueRepeat = document.querySelector("#profile-repeat-password").value;
        this.errorBox = null;
        this.addEventsToButtons();
        debugLog("prof FORM");
    }

    static msgIncorrectInput() {
        return messagesProfileForm.INCORRECT_MESSAGE;
    }

    static msgSuccess() {
        return messagesProfileForm.SUCCESS_MESSAGE;
    }

    static validate(nameValue, emailValue, passwordValue, newPasswordValue, newPasswordValueRepeat) {
        return true;
    }

    setFormValues(resp) {
        this.clearFields(
            "profile-name",
            "profile-email",
            "profile-old-password",
            "profile-new-password",
            "profile-repeat-password",
            "profile-form-error"
        );
        debugLog(this.nameValue + " " + resp.last_name);
        document.querySelector("#profile-name").value = resp.last_name;
        document.querySelector("#profile-email").value = resp.email;
    }

    static clearMessages() {
        document.getElementById("profile-form-ok").innerHTML = "";
        document.getElementById("profile-form-error").innerHTML = "";
    }

    sendRequest() {
        Requester.changeUserData(this.nameValue, this.emailValue, (err, resp) => {
            ProfileForm.clearMessages();
            if (err) {
                document.getElementById("profile-form-error").innerHTML = "Некорректный ввод";
                // console.log("Некорректный ввод");
                return;
            }
            this.setFormValues(resp);
            document.getElementById("profile-form-ok").innerHTML = ProfileForm.msgSuccess();
        });
    }

    sendRequestChangePswd() {
        Requester.changePassword(this.passwordValue, this.newPasswordValue, (err, resp) => {
            ProfileForm.clearMessages();
            if (err) {
                document.getElementById("profile-form-error").innerHTML = "Ошибка смены пароля";
                // console.log("Ошибка смены пароля");
                return;
            }
            document.getElementById("profile-form-ok").innerHTML = ProfileForm.msgSuccess();
        });
    }

    addEventsToButtons() {

        document.querySelector("#profile-form-btn").addEventListener("click", (event) => {
            event.preventDefault();
            this.nameValue = document.querySelector("#profile-name").value;
            this.emailValue = document.querySelector("#profile-email").value;
            this.passwordValue = document.querySelector("#profile-old-password").value;
            this.newPasswordValue = document.querySelector("#profile-new-password").value;
            this.newPasswordValueRepeat = document.querySelector("#profile-repeat-password").value;

            debugLog("prof BTN");
            const valid = ProfileForm.validate(this.nameValue, this.emailValue, this.passwordValue, this.newPasswordValue, this.newPasswordValueRepeat);

            if (valid) {
                if (this.passwordValue !== "") {
                    if (this.newPasswordValue === this.newPasswordValueRepeat && this.newPasswordValue !== "") {
                        this.sendRequestChangePswd();
                        debugLog("prof ch data");
                        this.sendRequest();
                    } else {
                        document.getElementById("profile-form-error").innerHTML = "Неверно повторили пароль";
                    }
                } else if (this.newPasswordValue !== "") {
                    document.getElementById("profile-form-error").innerHTML = "Введите старый пароль";
                } else {
                    this.sendRequest();
                }
            }
        });
    }
}
