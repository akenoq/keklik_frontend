"use strict";

export default function quizCard(title, description, date) {
    return `<img class="card-img-top" src="img/quiz_logo.png" alt="Card image cap">
            <div class="card-body pointer">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${description}</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">Дата изменения ${date}</small>
            </div>`
}
