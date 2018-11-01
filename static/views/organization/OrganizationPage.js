"use strict";

import Page from "../Page.js";
import PagePresenter from "../../modules/PagePresenter";
import Requester from "../../modules/network/Requester";
import globalBus from "../../modules/globalBus";
import AuthWorker from "../../modules/network/AuthWorker";
import debugLog from "../../modules/debugLog";
import organizationCard from "../office/organizations/organizationCard";
import userGroupsByOrgId from "../userGroupsByOrgId";

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

    render(org_id, org_name) {
        document.getElementById("to-course-btn-redirect").click();
        debugLog("ID ORGANIZATION = " + org_id + "_________userGroupsByOrgId");
        document.querySelector("#org-title span").innerHTML = org_name;
        let groups = userGroupsByOrgId(org_id);
        console.log(groups);
        let groups_len = groups.length;
        let table_groups = document.getElementById("table-groups-in-org");
        table_groups.innerHTML = "";

        for (let i = 0; i < groups_len; i++) {
            table_groups.innerHTML += `<div class="card game-card-in-group">
              <div id="group-card-${groups[i].group.id}" class="card-header">
                ${groups[i].group.name}
              </div>
              <div class="card-body">
                <h5 class="card-title">Актуальные соревнования</h5>
                <!--<p class="card-text">With supporting text below as a natural lead-in to additional content.</p>-->
                <!--<a href="#" class="btn btn-primary">Go somewhere</a>-->
              </div>
            </div>`;
        }
    }

    addEventsOnButtons() {

    }
}