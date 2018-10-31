"use strict";

export default function organizationCard(name, group_len, date) {
    return `<img class="card-img-top" src="img/course_logo.png" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">${group_len} групп на курсе</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">Дата изменения ${date}</small>
            </div>`
}