"use strict";

import FormValidator from "../../modules/FormValidator.js";
import Requester from "../../modules/network/Requester.js";
import fieldsCleaner from "./../../modules/fieldsCleaner.js";

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
        console.log("prof FORM");
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
        console.log(this.nameValue + " " + resp.last_name);
        document.querySelector("#profile-name").value = resp.last_name;
        document.querySelector("#profile-email").value = resp.email;
    }

    sendRequest() {
        Requester.changeUserData(this.nameValue, this.emailValue, (err, resp) => {
            if (err) {
                document.getElementById("profile-form-error").innerHTML = "patch err";
                return console.log("patch err");
            }
            this.setFormValues(resp);
            document.getElementById("profile-form-ok").innerHTML = ProfileForm.msgSuccess();
        });
    }

    sendRequestChangePswd() {
        Requester.changePassword(this.passwordValue, this.newPasswordValue, (err, resp) => {
            if (err) {
                document.getElementById("profile-form-error").innerHTML = "pswd err";
                return console.log("pswd err");
            }
            document.getElementById("profile-form-ok").innerHTML = ProfileForm.msgSuccess();
        });
    }

    addEventsToButtons() {

        document.querySelector("#profile-form-btn").addEventListener("click", () => {
            this.nameValue = document.querySelector("#profile-name").value;
            this.emailValue = document.querySelector("#profile-email").value;
            this.passwordValue = document.querySelector("#profile-old-password").value;
            this.newPasswordValue = document.querySelector("#profile-new-password").value;
            this.newPasswordValueRepeat = document.querySelector("#profile-repeat-password").value;

            console.log("prof BTN");
            const valid = ProfileForm.validate(this.nameValue, this.emailValue, this.passwordValue, this.newPasswordValue, this.newPasswordValueRepeat);

            if (valid) {
                if (this.passwordValue !== "") {
                    if (this.newPasswordValue === this.newPasswordValueRepeat && this.newPasswordValue !== "") {
                        this.sendRequestChangePswd();
                        console.log("prof ch data");
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
