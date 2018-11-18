"use strict";

const TAGS = [
    "программирование", "информатика", "математика", "английский", "физика",
    "история", "химия", "биология", "география", "литература", "русский"
];

const SRC = {
    "программирование" : "img/tags/infa.png",
    "информатика" : "img/tags/infa.png",
    "математика" : "img/tags/math.png",
    "английский" : "img/tags/eng.png",
    "физика" : "img/tags/phy.png",
    "история" : "img/tags/hist.png",
    "химия" : "img/tags/chem.png",
    "биология" : "img/tags/bio.png",
    "география" : "img/tags/geo.png",
    "литература" : "img/tags/lit.png",
    "русский" : "img/tags/lit.png"
};

export default function quizCard(title, description, date, tags) {
    console.log(tags);
    let find_index = -1;
    let src = "img/quiz_logo.png";
    for (let i = 0; i < tags.length; i++) {
        let tag = tags[i].toLowerCase().split(" ").join(""); // без пробелов
        find_index = TAGS.indexOf(tag);
        if (find_index !== -1) {
            src = SRC[TAGS[find_index]];
            break;
        }
    }
    return `<img class="card-img-top" src=${src} alt="Card image cap">
            <div class="card-body pointer">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${description}</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">Дата изменения ${date}</small>
            </div>`
}
