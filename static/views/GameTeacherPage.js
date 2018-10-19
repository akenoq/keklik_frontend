"use strict";

import Page from "./Page.js";
import PagePresenter from "../modules/PagePresenter";

export default class GameTeacherPage extends Page {

    constructor() {
        super();
        this.addEventsOnButtons();
        console.log("teacher")
    }

    static pagePath() {
        return "/teacher";
    }

    static pageBoxName() {
        return "teacher-page";
    }

    attachRedirect() {
        this.addRedirectOnButtons(
            {button: "start-game-btn", nextPage: "play-page-manage", pagePath: "/teacher"}
        );
        console.log("add redirect");
    }

    addEventsOnButtons() {

    }
}