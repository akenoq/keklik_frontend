"use strict";

import Page from "../../Page";
import Requester from "../../../modules/network/Requester.js";
import linkOnButtons from "../../../modules/linkOnButtons";
import globalBus from "../../../modules/globalBus.js";
import statisticItem from "./statisticItem";
import debugLog from "../../../modules/debugLog";
import AuthWorker from "../../../modules/network/AuthWorker";
import userGroupsByOrgId from "../../userGroupsByOrgId";

export default class StaticticTable extends Page {

    static render() {
        debugLog("Statictic Table");
        let statDesk = document.getElementById("table-statistic");
        statDesk.innerHTML = "";

        Requester.getGameByUser((err, resp) => {
            if (err) {
                debugLog("err load user games");
            } else {
                if (resp.length === 0) {
                    statDesk.innerHTML = "<h3>Вы не провели ни одного соревнования</h3>";
                } else {
                    let content = "";
                    // до 10
                    let len = resp.length < 10 ? resp.length : 10;
                    for (let i = 0; i < len; i++) {
                        let game = resp[i];
                        content += statisticItem(game.id, game.quiz.title, game.created_at.split("T")[0],
                            game.group !== null ? game.group.organization.name : "─",
                            game.group !== null ? game.group.name : "─");
                    }
                    statDesk.innerHTML = content;
                    for (let i = 0; i < len; i++) {
                        let game = resp[i];
                        document.getElementById(`statistic-xls-by-pin-${game.id}`)
                            .onclick = function() {open(`http://api.keklik.xyz/media/games/${game.id}/report`)};
                    }
                }
            }
        });
    }
}