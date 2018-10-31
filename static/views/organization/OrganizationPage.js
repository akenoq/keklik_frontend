"use strict";

import Page from "../Page.js";
import PagePresenter from "../../modules/PagePresenter";
import Requester from "../../modules/network/Requester";
import globalBus from "../../modules/globalBus";
import AuthWorker from "../../modules/network/AuthWorker";
import debugLog from "../../modules/debugLog";
import organizationCard from "../office/organizations/organizationCard";

export default class OrganizationPage extends Page {

    constructor() {
        super();
        this.addEventsOnButtons();

        let btnToGroup = document.createElement('button');
        btnToGroup.setAttribute('id', 'to-group-btn-redirect');
        btnToGroup.hidden = true;
        document.body.appendChild(btnToGroup);
        this.addRedirectOnButtons(
            {button: "to-group-btn-redirect", nextPage: "group-page", pagePath: "/group"}
        );

        console.log("course")
    }

    static pagePath() {
        return "/course";
    }

    static pageBoxName() {
        return "course-page";
    }

    render(id, resp) {
        document.getElementById("to-course-btn-redirect").click();
        debugLog("ID ORGANIZATION = " + id);
        console.log(resp);
        document.querySelector("#org-title span").innerHTML = resp.name;
        let groups = resp.groups;
        console.log(groups);
        let groups_len = groups.length;
        let table_groups = document.getElementById("table-groups-in-org");
        table_groups.innerHTML = "";
        for (let i = 0; i < groups_len; i++) {
            table_groups.innerHTML += `<tr id="group-card-${groups[i].id}" class="table-group-line">
                <th scope="row">${i+1}</th>
                <td>${groups[i].name}</td>
                <td>${groups[i].created_at.split("T")[0]}</td>
            </tr>`
        }
    }

    addEventsOnButtons() {

    }
}