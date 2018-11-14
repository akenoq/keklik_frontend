"use strict";

import globalBus from "../modules/globalBus";

export default function userGroupsByOrgId(org_id) {
    let groups = [];
    let len_groups = globalBus().saver.userGroups.length;
    for (let i = 0; i < len_groups; i++) {
        if (globalBus().saver.userGroups[i].group.organization.id === org_id) {
            groups.push(globalBus().saver.userGroups[i]);
        }
    }
    return groups;
}