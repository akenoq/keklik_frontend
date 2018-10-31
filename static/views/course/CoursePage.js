"use strict";

import Page from "../Page.js";
import PagePresenter from "../../modules/PagePresenter";
import Requester from "../../modules/network/Requester";
import globalBus from "../../modules/globalBus";
import AuthWorker from "../../modules/network/AuthWorker";
import debugLog from "../../modules/debugLog";
import organizationCard from "../office/organizations/organizationCard";

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

    addEventsOnButtons() {

    }
}