"use strict";

import debugLog from "./debugLog";

export default function htmlEntities(s) {
    s = s + "";
    let div = document.createElement('div');
    let text = document.createTextNode(s);
    div.appendChild(text);
    debugLog("______@@@______" + div.innerHTML);
    return div.innerHTML;
}
