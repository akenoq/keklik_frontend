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

    static render(url="http://api.keklik.xyz/api/games/my/?limit=5&offset=0") {
        debugLog("Statictic Table");
        let statDesk = document.getElementById("table-statistic");

        Requester.getGameByUser(url, (err, resp) => {
            if (err) {
                debugLog("err load user games");
            } else {
                statDesk.innerHTML = "";
                let next_page = resp.next;
                let prev_page = resp.previous;
                resp = resp.results;
                if (resp.length === 0) {
                    statDesk.innerHTML = "<h3>Вы не провели ни одного соревнования</h3>";
                } else {
                    let content = "";
                    // до 10
                    let len = resp.length < 10 ? resp.length : 10;
                    for (let i = 0; i < len; i++) {
                        let game = resp[i];
                        content += statisticItem(game.id, game.quiz.title, game.created_at.split("T")[0],
                            game.group !== null ? game.group.organization.name : null,
                            game.group !== null ? game.group.name : null);
                    }

                    let paginator = `<nav aria-label="Page navigation example">
                                  <ul class="pagination justify-content-center">
                                    <li id="prev-page-statistic" class="page-item">
                                      <span class="page-link"><i class="fa fa-chevron-left" aria-hidden="true"></i></span>
                                    </li>
                                    <li id="next-page-statistic" class="page-item">
                                      <span class="page-link"><i class="fa fa-chevron-right" aria-hidden="true"></i></span>
                                    </li>
                                  </ul>
                                </nav>`;

                    statDesk.innerHTML = content + "<br>" + paginator;
                    for (let i = 0; i < len; i++) {
                        let game = resp[i];
                        document.getElementById(`statistic-xls-by-pin-${game.id}`)
                            .onclick = function() {open(`http://api.keklik.xyz/media/games/${game.id}/report`)};
                    }

                    if (next_page === null) {
                        document.getElementById("next-page-statistic").setAttribute('class','page-item disabled');
                    } else {
                        document.getElementById("next-page-statistic").setAttribute('class','page-item');
                        document.getElementById("next-page-statistic").onclick = () => {
                            StaticticTable.render(next_page);
                        }
                    }

                    if (prev_page === null) {
                        document.getElementById("prev-page-statistic").setAttribute('class','page-item disabled');
                    } else {
                        document.getElementById("prev-page-statistic").setAttribute('class','page-item');
                        document.getElementById("prev-page-statistic").onclick = () => {
                            StaticticTable.render(prev_page);
                        }
                    }
                }
            }
        });
    }
}