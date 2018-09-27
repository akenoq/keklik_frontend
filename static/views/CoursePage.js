"use strict";

import Page from "./Page.js";
import PagePresenter from "../modules/PagePresenter";

export default class CoursePage extends Page {

    constructor() {
        super();
        this.addEventsOnButtons();
        this.addRedirectOnButtons(
            {button: "group-card-1", nextPage: "group-page", pagePath: "/group"}
        );
        console.log("course")
    }

    static pagePath() {
        return "/course";
    }

    static pageBoxName() {
        return "course-page";
    }

    getForm() {
        return this.form;
    }

    addEventsOnButtons() {

    }
}