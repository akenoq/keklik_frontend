"use strict";

import globalBus from "./globalBus.js";
import RegisterPage from "../views/RegisterPage.js";
import PagePresenter from "./PagePresenter.js";
import linkOnButtons from "./linkOnButtons.js";
import OfficePage from "../views/OfficePage";
import CoursePage from "../views/CoursePage";
import GroupPage from "../views/GroupPage";

export default class Router {
    constructor() {

        this.addRedirectOnNavBtn(
            {button: "nav-main-btn", nextPage: "main-page", pagePath: "/main"},
            {button: "nav-login-btn", nextPage: "register-page", pagePath: "/register"},
            {button: "nav-info-btn", nextPage: "info-page", pagePath: "/info"},
            {button: "nav-office-btn", nextPage: "office-page", pagePath: "/office"}
    );

        // page
        globalBus().registerPage = new RegisterPage();
        globalBus().officePage = new OfficePage();
        globalBus().coursePage = new CoursePage();
        globalBus().groupPage = new GroupPage();

        // pagePath
        const registerPagePath = RegisterPage.pagePath();
        // const infoPage = new InfoPage();

        globalBus().registerPage.addRedirectOnButtons(
            {button: "regformBtn", nextPage: "login-page", pagePath: "/main"}
        );

        Router.redirect();

        window.addEventListener("popstate", () => {
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
        switch (pathname) {
            case "/main":
                PagePresenter.showOnlyOnePage("main-page");
                break;

            case "/office":
                PagePresenter.showOnlyOnePage("office-page");
                break;

            case "/register":
                PagePresenter.showOnlyOnePage("register-page");
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

            default:
                PagePresenter.showOnlyOnePage("main-page");
                break;
        }
    }
}