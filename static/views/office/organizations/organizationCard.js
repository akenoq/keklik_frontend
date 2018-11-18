"use strict";

export default function organizationCard(name, group_len, date) {
    let src_ava = "img/school.jpg";
    if (name === "Школа 218")
        src_ava = "img/org/218_ava.jpg";
    if (name === "Школа 444")
        src_ava = "img/org/444_ava.jpg";
    if (name === "Инжинириум МГТУ им.Баумана")
        src_ava = "img/org/ing_ava.png";

    return `<img class="card-img-top" src=${src_ava} alt="Card image cap">
            <div class="card-body pointer">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">${group_len} групп на курсе</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">Дата изменения ${date}</small>
            </div>`
}