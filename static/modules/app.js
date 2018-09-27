"use strict";

import globalBus from "./globalBus.js"
import Router from "./Router.js"
import RegisterPage from "../views/RegisterPage.js";
import RegisterForm from "./RegisterForm.js";
import OfficePage from "../views/OfficePage.js";
import CoursesPage from "../views/CoursePage.js";

function startApp() {
    console.log("HELLO APP");

    globalBus().router = new Router();
    let router = globalBus().router;
    // router = router.getMe(router);
    // router.sendRouter();
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
    changingColor();
    startApp();
    document.querySelector(".main-box").hidden = false;
});