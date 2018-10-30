"use strict";

import Page from "./Page.js";
import PagePresenter from "../modules/PagePresenter";
import Requester from "../modules/network/Requester";
import globalBus from "../modules/globalBus";
import AuthWorker from "../modules/network/AuthWorker";
import debugLog from "../modules/debugLog";

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

    render() {
        return Requester.organizationsAll((err, resp) => {
            if (err) {
                return alert("all organizations error");
            }
            debugLog(resp);
            let userOrganizations = [];
            let organizations_len = resp.length;
            for (let i = 0; i < organizations_len; i++) {
                let admins = resp[i].admins;
                let admins_len = admins.length;
                debugLog(resp[i]);
                for (let j = 0; j < admins_len; j++){
                    if (admins[j].user.username === AuthWorker.getUsername()) {
                        userOrganizations.push(resp[i]);
                        debugLog("pushed");
                    }
                }

            }
        });
    }

    addEventsOnButtons() {

    }
}