"use strict";

import Page from "../../Page";
import Requester from "../../../modules/network/Requester.js";
import linkOnButtons from "../../../modules/linkOnButtons";
import globalBus from "../../../modules/globalBus.js";
import organizationCard from "./organizationCard";
import debugLog from "../../../modules/debugLog";
import AuthWorker from "../../../modules/network/AuthWorker";
import userGroupsByOrgId from "../../userGroupsByOrgId";

export default class OrganizationDesk extends Page {

    static render() {
        console.log("Quiz Desk");
        let orgDesk = document.getElementById("org-desk");
        orgDesk.innerHTML = "";
        let cardsInRow = 0;
        let rowCount = 1;
        let resp = globalBus().saver.userOrg;

        if (resp.length === 0) {
            orgDesk.innerHTML = "<h3>Вы не состоите ни в одной организации</h3>";
        }
        for (let i = 0; i < resp.length; i++) {
            if (cardsInRow === 3) {
                cardsInRow = 0;
                rowCount++;
            }
            if (cardsInRow === 0) {
                let newRow = document.createElement('div');
                newRow.setAttribute("id", `org-card-row-${rowCount}`);
                newRow.setAttribute("class", "card-deck");
                orgDesk.appendChild(newRow);
                console.log("new row = ");
                console.log(newRow);
            }
            let caBox = document.createElement('div');
            caBox.setAttribute("id", `org-card-${resp[i].id}`);
            caBox.setAttribute("class", "card org-desk__org-card");
            let groups = [];
            let org_id = resp[i].id;
            groups = userGroupsByOrgId(org_id);

            caBox.innerHTML = organizationCard(resp[i].name, groups.length, resp[i].updated_at.split("T")[0]);

            document.getElementById(`org-card-row-${rowCount}`).appendChild(caBox);
            document.getElementById(`org-card-${resp[i].id}`).onclick = () => {
                OrganizationDesk.redirectToOrganization(resp[i].id, resp[i].name)
            };
            cardsInRow++;
        }
    }

    static redirectToOrganization(id, name) {
        debugLog("redirect to course " + id + " with name " + name);
        globalBus().organizationPage.render(id, name);
    }

    static organizationReq(callback) {
        Requester.organizationsAll((err, resp) => {
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
            callback(userOrganizations);
        });
    }
}