"use strict";

import globalBus from "./globalBus.js";
import RegisterPage from "../views/registion/RegisterPage.js";
import LoginPage from "../views/login/LoginPage.js";
import PagePresenter from "./PagePresenter.js";
import linkOnButtons from "./linkOnButtons.js";
import OfficePage from "../views/office/OfficePage";
import CoursePage from "../views/CoursePage";
import GroupPage from "../views/GroupPage";
import Requester from "./network/Requester";
import QuizEditorPage from "../views/edit_quiz/QuizEditorPage";
import GameManager from "./GameManager";
import GameTeacherPage from "../views/GameTeacherPage";
import GameStudentPage from "../views/GameStudentPage";
import ModalWindow from "../views/ModalWindow";

export default class Router {
    constructor() {

        this.addRedirectOnNavBtn(
            {button: "nav-main-btn", nextPage: "main-page", pagePath: "/main"},
            {button: "nav-login-btn", nextPage: "login-page", pagePath: "/login"},
            {button: "nav-info-btn", nextPage: "info-page", pagePath: "/info"},
            {button: "nav-office-btn", nextPage: "office-page", pagePath: "/office"}
        );

        // global nav
        globalBus().btn = {};
        globalBus().nav = {};
        globalBus().btn.loginBtn = document.getElementById("nav-login-btn");
        globalBus().btn.signoutBtn = document.getElementById("nav-signout-btn");
        globalBus().nav.loginBox = document.getElementById("nav-login-box");
        globalBus().btn.officeBtn = document.getElementById("nav-office-btn");

        new ModalWindow();

        // page
        globalBus().registerPage = new RegisterPage();
        globalBus().loginPage = new LoginPage();
        globalBus().officePage = new OfficePage();
        globalBus().coursePage = new CoursePage();
        globalBus().groupPage = new GroupPage();
        globalBus().quizEditor = new QuizEditorPage();

        globalBus().gameTeacherPage = new GameTeacherPage();
        globalBus().gameStudentPage = new GameStudentPage();
        globalBus().gameManager = new GameManager();

        // pagePath
        const registerPagePath = RegisterPage.pagePath();
        // const infoPage = new InfoPage();

        linkOnButtons(
            {button: "regform-to-login-link", nextPage: "login-page", pagePath: "/login"},
            {button: "login-form-to-register-link", nextPage: "register-page", pagePath: "/register"},
        );

        globalBus().btn.signoutBtn.onclick = () => {
            globalBus().authWorker.deleteToken();
            globalBus().btn.signoutBtn.hidden =true;
            globalBus().btn.loginBtn.hidden =false;
            globalBus().btn.loginBtn.click();
            globalBus().nav.loginBox.innerHTML = "";
        };

        Router.redirect();

        window.addEventListener("popstate", () => {
            globalBus().modalWindow.hide();
            Router.redirect();
            // registerPage.getForm().clearForm();
            // this.loginPage.getForm().clearForm();
        });
    }

    navigate() {

    }

    addRedirectOnNavBtn(...buttons) {
        linkOnButtons(...buttons);
    }

    static redirect() {
        const pathname = window.location.pathname;
        Requester.whoami((err, resp) => {
            if (err) {
                globalBus().btn.signoutBtn.hidden =true;
                globalBus().btn.loginBtn.hidden =false;
                globalBus().nav.loginBox.innerHTML = "";
                switch (pathname) {

                    case "/":
                        PagePresenter.showOnlyOnePage("main-page");
                        break;

                    case "/main":
                        PagePresenter.showOnlyOnePage("main-page");
                        break;

                    case "/office":
                        globalBus().btn.loginBtn.click();
                        break;

                    case "/register":
                        PagePresenter.showOnlyOnePage("register-page");
                        break;

                    case "/login":
                        PagePresenter.showOnlyOnePage("login-page");
                        break;

                    case "/info":
                        PagePresenter.showOnlyOnePage("info-page");
                        break;

                    default:
                        globalBus().btn.loginBtn.click();
                        break;
                }
                return console.log("NOT AUTH");
            } else if (resp) {
                globalBus().btn.signoutBtn.hidden = false;
                globalBus().btn.loginBtn.hidden = true;
                globalBus().nav.loginBox.innerHTML = resp.username;
                switch (pathname) {

                    case "/main":
                        PagePresenter.showOnlyOnePage("main-page");
                        break;

                    case "/office":
                        Requester.whoami((err, resp) => {
                            if (err) {
                                globalBus().btn.loginBtn.click();
                                return console.log("office error router");
                            }
                            globalBus().officePage.render();
                            PagePresenter.showOnlyOnePage("office-page");
                            return console.log("office norm router");
                        });
                        break;

                    case "/info":
                        PagePresenter.showOnlyOnePage("info-page");
                        break;

                    case "/course":
                        PagePresenter.showOnlyOnePage("course-page");
                        break;

                    case "/group":
                        PagePresenter.showOnlyOnePage("group-page");
                        break;

                    case "/play":
                        PagePresenter.showOnlyOnePage("play-page");
                        break;

                    case "/edit":
                        PagePresenter.showOnlyOnePage("edit-page");
                        break;

                    case "/teacher":
                        PagePresenter.showOnlyOnePage("play-page-manage");
                        break;

                    default:
                        PagePresenter.showOnlyOnePage("office-page");
                        globalBus().officePage.render();
                        PagePresenter.showOnlyOnePage("office-page");
                        break;
                }
                return console.log("NORM AUTH");
            }
        });
    }
}