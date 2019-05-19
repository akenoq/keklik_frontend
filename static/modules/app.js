"use strict";

import globalBus from "./globalBus.js"
import Router from "./Router.js";
import RegisterPage from "../views/registion/RegisterPage.js";
import RegisterForm from "../views/registion/RegisterForm.js";
import LoginPage from "../views/login/LoginPage.js";
import LoginForm from "../views/login/LoginForm.js";
import OfficePage from "../views/office/OfficePage.js";
import OrganizationPage from "../views/organization/OrganizationPage.js";
import GroupPage from "../views/GroupPage.js";
import Requester from "./network/Requester.js";
import AuthWorker from "./network/AuthWorker";
import QuizEditorPage from "../views/edit_quiz/QuizEditorPage";

function startApp() {
    // console.log("HELLO APP");
    globalBus().authWorker = new AuthWorker();
    globalBus().router = new Router();
    let router = globalBus().router;
    // router = router.getMe(router);
    // router.sendRouter();
    document.getElementById("download-manual").onclick = function() {
        open(`./img/landing/Keklik_quick_start.pdf`)
    };
    Requester.getNumberGames((err, resp) => {
        let num = 435;
        if (err) {
            console.log("err counter");
        } else {
            num = resp.games_count;
        }
        document.getElementById("landing-counter").innerHTML = num;
    });
    globalBus().unloadFunc = (event) => {
        event.preventDefault();
        event.returnValue = '';
    };

    window.addEventListener("beforeunload", globalBus().unloadFunc);
    // document.body.onbeforeunload = () => {
    //     return "try to go away";
    // };
}

function changingColor() {
    let colorValue = {
        R: 255,
        G: 0,
        B: 0
    };

    let growFlag = true;

    let colorInterval = setInterval(() => {
        document.body.style.backgroundColor = "rgb("+colorValue.R+", "+colorValue.G+", " + colorValue.B+")";
        if (colorValue.G <= 250 && growFlag) {
            colorValue.G += 1;
        } else if (colorValue.G >= 5 && !growFlag) {
            colorValue.G -= 1;
        } else growFlag = !growFlag;
    }, 100);
}

window.addEventListener("load", function () {
    // changingColor();
    startApp();
    document.querySelector(".main-box").hidden = false;
});