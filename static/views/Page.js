"use strict";

import linkOnButtons from "../modules/linkOnButtons.js";

export default class Page {

    constructor() {
        Page.pagePath();
        Page.pageBoxName();
        this.addEventsOnButtons();
    }

    static pagePath() {}

    static pageBoxName() {}

    addEventsOnButtons() {}

    addRedirectOnButtons(...buttons) {
        linkOnButtons(...buttons)
    }
}