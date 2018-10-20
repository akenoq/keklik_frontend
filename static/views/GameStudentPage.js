"use strict";

import Page from "./Page.js";
import PagePresenter from "../modules/PagePresenter";

export default class GameStudentPage extends Page {

    constructor() {
        super();
        this.addEventsOnButtons();
        console.log("student")
    }

    static pagePath() {
        return "/play";
    }

    static pageBoxName() {
        return "play-page";
    }

    attachRedirect() {
        this.addRedirectOnButtons(
            {button: "join-game-btn", nextPage: "play-page", pagePath: "/play"}
        );
        console.log("add redirect");
    }

    addEventsOnButtons() {

    }
}