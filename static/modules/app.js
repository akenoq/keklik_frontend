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

window.addEventListener("load", function () {
    startApp();
    document.querySelector(".main-box").hidden = false;
});