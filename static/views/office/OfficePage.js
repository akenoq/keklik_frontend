"use strict";

import Page from "../Page.js";
import PagePresenter from "../../modules/PagePresenter";
import globalBus from "../../modules/globalBus";
import Requester from "../../modules/network/Requester";
import QuizzesDesk from "./quizzes/QuizzesDesk";
import ProfileForm from "./ProfileForm";
import GameManager from "../../modules/GameManager";
import OrganizationDesk from "./organizations/OrganizationDesk";
import debugLog from "../../modules/debugLog";
import StatisticTable from "./statistic/StaticticTable";

export default class OfficePage extends Page {

    constructor() {
        super();
        // щелчок по карточке курса
        let btnToCourse = document.createElement('button');
        btnToCourse.setAttribute('id', 'to-course-btn-redirect');
        btnToCourse.hidden = true;
        document.body.appendChild(btnToCourse);
        this.addRedirectOnButtons(
            {button: "to-course-btn-redirect", nextPage: "course-page", pagePath: "/course"}
        );

        this.addEventsOnButtons();
        debugLog("office");
        globalBus().user = {};
        this.profileForm = new ProfileForm();

        globalBus().count_ws = 0;
        globalBus().joinBtnFlag = false;
        // this.target_pin = null;
    }

    static pagePath() {
        return "/office";
    }

    static pageBoxName() {
        return "office-page";
    }

    joinGameBtn() {
        // join to game btn
        globalBus().gameStudentPage.attachRedirect();
        document.getElementById("join-game-btn").addEventListener("click", () => {
            const game_id = parseInt(document.getElementById("game-pin-input").value);
            debugLog("INPUT ID = " + game_id);
            if (!isNaN(game_id)) {
                document.getElementById("join-game-btn_clicker").click(); // redirect
                document.getElementById("game-pin-input").setAttribute('data-nec', 'true');
                globalBus().gameManager.join(game_id);
                globalBus().count_ws += 1;
                debugLog("WS COUNT = " + globalBus().count_ws);
                document.getElementById("game-pin-input").value = "";
            } else {
                document.getElementById("game-pin-input").setAttribute('data-nec', 'empty');
            }
        });
    }

    renderListManaged(){
        Requester.getRunningGameByUser((err, resp) => {
            if (err) {
                debugLog("err load user running games");
            } else {
                debugLog("RESP");
                debugLog(resp);
                globalBus().saver.userRunningGames = [];
                let games = resp;
                let len_games = games.length;
                for (let i = 0; i < len_games; i++) {
                    globalBus().saver.userRunningGames.push(games[i]);
                }
                // this.target_pin = null;
                let running_game_box = document.getElementById("rannunig-games-warning");
                running_game_box.innerHTML = "";
                if (globalBus().saver.userRunningGames.length !== 0) {
                    let managed_game = globalBus().saver.userRunningGames;
                    let managed_game_len = managed_game.length;
                    if (managed_game_len !== 0) {
                        let content = "";
                        for (let i = 0; i < managed_game_len; i++) {
                            let div = document.createElement('div');
                            running_game_box.appendChild(div);
                            div.innerHTML = `
                                <button id="delete-managed-by-id-${managed_game[i].id}" type="button" class="btn btn-danger">
                                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                                </button>&nbsp;
                                <button id="select-managed-by-id-${managed_game[i].id}" type="button" class="btn btn-success">
                                    <i class="fa fa-play" aria-hidden="true"></i>
                                </button> &nbsp;
                                &#9888; У вас есть запущенное вами соревнование PIN ${managed_game[i].id}
                                <br><br>
                            `;
                            document.getElementById(`select-managed-by-id-${managed_game[i].id}`).onclick = () => {
                                globalBus().gameManager.joined_counter = 0;
                                globalBus().gameTeacherPage.attachRedirect();
                                globalBus().gameManager.restart_manage(managed_game[i].id);
                                document.getElementById("start-game-btn_clicker").click(); // redirect
                                div.innerHTML = "";
                                // this.target_pin = managed_game[i].id;
                                debugLog("REDIRECT TO RESTART");
                            };
                            document.getElementById(`delete-managed-by-id-${managed_game[i].id}`).onclick = () => {
                                Requester.delGameById((managed_game[i].id), (err, resp) => {
                                    if (err) {
                                        console.log("err of del game")
                                    } else {
                                        div.innerHTML = "";
                                    }
                                });
                            }
                        }
                    }
                }
            }
        });
        debugLog("__________________RUNNING GAMES =");
        debugLog(globalBus().saver.userRunningGames);
    }

    rejoinManagedGameBtn() {
        document.getElementById("managed-game-btn").onclick = () => {
            if (this.target_pin !== null) {
                globalBus().gameManager.joined_counter = 0;
                globalBus().gameTeacherPage.attachRedirect();
                globalBus().gameManager.restart_manage(this.target_pin);
                document.getElementById("start-game-btn_clicker").click(); // redirect
                document.getElementById("selected-managed-game").innerHTML = "Управляемые PIN...";
                debugLog("REDIRECT TO RESTART");
            }
        }
    }

    render() {
        return Requester.whoami((err, resp) => {
            if (err) {
                debugLog("office err");
            } else {
                globalBus().user = resp;
                document.getElementById("office-header-username").innerHTML = globalBus().user.username;
                globalBus().nav.loginBox.innerHTML = resp.username;
                this.profileForm.setFormValues(resp);
                OrganizationDesk.render();
                QuizzesDesk.render();
                StatisticTable.render();
                this.renderListManaged();
                // добавляем листнеры на кнопу присоединиться
                if (globalBus().joinBtnFlag === false) {
                    this.joinGameBtn();
                    // this.rejoinManagedGameBtn();
                    globalBus().joinBtnFlag = true;
                }
                debugLog("office norm");
            }
        });
    }

    addEventsOnButtons() {
        document.getElementById("to-courses-btn").onclick = () => {
            debugLog("C1");
            document.getElementById("org-desk").hidden = false;
            document.getElementById("to-quizzes-btn").classList.remove("active");
            document.getElementById("quizzes-desk").hidden = true;
            document.getElementById("to-courses-btn").classList.add("active");
            document.getElementById("profile").hidden = true;
            document.getElementById("to-profile-btn").classList.remove("active");
            document.getElementById("statistic").hidden = true;
            document.getElementById("to-statistic-btn").classList.remove("active");
        };

        document.getElementById("to-quizzes-btn").onclick = () => {
            debugLog("C2");
            document.getElementById("org-desk").hidden = true;
            document.getElementById("to-quizzes-btn").classList.add("active");
            document.getElementById("quizzes-desk").hidden = false;
            document.getElementById("to-courses-btn").classList.remove("active");
            document.getElementById("profile").hidden = true;
            document.getElementById("to-profile-btn").classList.remove("active");
            document.getElementById("statistic").hidden = true;
            document.getElementById("to-statistic-btn").classList.remove("active");
        };

        document.getElementById("to-profile-btn").onclick = () => {
            debugLog("C3");
            document.getElementById("org-desk").hidden = true;
            document.getElementById("to-quizzes-btn").classList.remove("active");
            document.getElementById("quizzes-desk").hidden = true;
            document.getElementById("to-courses-btn").classList.remove("active");
            document.getElementById("profile").hidden = false;
            document.getElementById("to-profile-btn").classList.add("active");
            document.getElementById("statistic").hidden = true;
            document.getElementById("to-statistic-btn").classList.remove("active");
        };

        document.getElementById("to-statistic-btn").onclick = () => {
            debugLog("C1");
            document.getElementById("org-desk").hidden = true;
            document.getElementById("to-quizzes-btn").classList.remove("active");
            document.getElementById("quizzes-desk").hidden = true;
            document.getElementById("to-courses-btn").classList.remove("active");
            document.getElementById("profile").hidden = true;
            document.getElementById("to-profile-btn").classList.remove("active");
            document.getElementById("statistic").hidden = false;
            document.getElementById("to-statistic-btn").classList.add("active");
        };
    }
}