"use strict";

import Page from "./Page.js";
import PagePresenter from "../modules/PagePresenter";

export default class GroupPage extends Page {

    constructor() {
        super();
        this.addEventsOnButtons();
        this.addRedirectOnButtons(
            {button: "to-play-btn-1", nextPage: "play-page", pagePath: "/play"}
        );
        console.log("group")
    }

    static pagePath() {
        return "/group";
    }

    static pageBoxName() {
        return "group-page";
    }

    addEventsOnButtons() {

    }
}