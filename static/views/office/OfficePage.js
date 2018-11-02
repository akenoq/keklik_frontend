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
        console.log("office");
        globalBus().user = {};
        this.profileForm = new ProfileForm();

        globalBus().count_ws = 0;
        globalBus().joinBtnFlag = false;
        this.target_pin = null;
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
                console.log("WS COUNT = " + globalBus().count_ws);
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
                this.target_pin = null;
                let listManagedGameBtn = document.getElementById("list-managed-game-btn");
                listManagedGameBtn.innerHTML = "";
                if (globalBus().saver.userRunningGames.length !== 0) {
                    let managed_game = globalBus().saver.userRunningGames;
                    let managed_game_len = managed_game.length;
                    document.getElementById("selected-managed-game").innerHTML = "Управляемые PIN...";
                    for (let i = 0; i < managed_game_len; i++) {
                        debugLog("render a");
                        let a = document.createElement('a');
                        a.setAttribute('class', 'dropdown-item');
                        listManagedGameBtn.appendChild(a);
                        a.innerHTML = "PIN " + managed_game[i].id;
                        a.setAttribute('id', `select-managed-by-id-${managed_game[i].id}`);
                        a.onclick = () => {
                            debugLog("change selected-manage text");
                            document.getElementById("selected-managed-game").innerHTML = managed_game[i].id;
                            this.target_pin = managed_game[i].id;
                            debugLog("учительский ПИН = "+ managed_game[i].id.toString());
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
                this.renderListManaged();
                if (globalBus().joinBtnFlag === false) {
                    this.joinGameBtn();
                    this.rejoinManagedGameBtn();
                    globalBus().joinBtnFlag = true;
                }
                debugLog("office norm");
            }
        });
    }

    addEventsOnButtons() {
        document.getElementById("to-courses-btn").onclick = () => {
            console.log("C1");
            document.getElementById("org-desk").hidden = false;
            document.getElementById("to-quizzes-btn").classList.remove("active");
            document.getElementById("quizzes-desk").hidden = true;
            document.getElementById("to-courses-btn").classList.add("active");
            document.getElementById("profile").hidden = true;
            document.getElementById("to-profile-btn").classList.remove("active");
        };

        document.getElementById("to-quizzes-btn").onclick = () => {
            console.log("C2");
            document.getElementById("org-desk").hidden = true;
            document.getElementById("to-quizzes-btn").classList.add("active");
            document.getElementById("quizzes-desk").hidden = false;
            document.getElementById("to-courses-btn").classList.remove("active");
            document.getElementById("profile").hidden = true;
            document.getElementById("to-profile-btn").classList.remove("active");
        };

        document.getElementById("to-profile-btn").onclick = () => {
            console.log("C3");
            document.getElementById("org-desk").hidden = true;
            document.getElementById("to-quizzes-btn").classList.remove("active");
            document.getElementById("quizzes-desk").hidden = true;
            document.getElementById("to-courses-btn").classList.remove("active");
            document.getElementById("profile").hidden = false;
            document.getElementById("to-profile-btn").classList.add("active");
        }
    }
}